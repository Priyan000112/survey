import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { VotePayload, VoteRecord } from "@/lib/types";

const dataDir = path.join(process.cwd(), "data");
const voteFile = path.join(dataDir, "votes.json");

type StoreMode = "file" | "supabase";

type StoredVoteRecord = VoteRecord & {
  sessionId: string;
  fingerprintHash: string;
};

type InsertContext = {
  sessionId: string;
  fingerprintHash: string;
};

type InsertResult = {
  duplicate: boolean;
  vote?: VoteRecord;
};

function hasSupabaseConfig() {
  return Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function allowFileVoteStore() {
  return process.env.ALLOW_FILE_VOTE_STORE === "true";
}

function getSupabaseConfig() {
  return {
    url: process.env.SUPABASE_URL!,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    table: process.env.SUPABASE_VOTES_TABLE || "votes"
  };
}

function toPublicVote(vote: StoredVoteRecord): VoteRecord {
  return {
    candidateId: vote.candidateId,
    issue: vote.issue,
    dusun: vote.dusun,
    ageGroup: vote.ageGroup,
    satisfaction: vote.satisfaction,
    timestamp: vote.timestamp
  };
}

function mapStoredVote(raw: Record<string, unknown>): StoredVoteRecord | null {
  if (
    typeof raw.candidateId !== "string" ||
    typeof raw.issue !== "string" ||
    typeof raw.dusun !== "string" ||
    typeof raw.ageGroup !== "string" ||
    typeof raw.satisfaction !== "string" ||
    typeof raw.timestamp !== "number"
  ) {
    return null;
  }

  return {
    candidateId: raw.candidateId,
    issue: raw.issue,
    dusun: raw.dusun,
    ageGroup: raw.ageGroup,
    satisfaction: raw.satisfaction,
    timestamp: raw.timestamp,
    sessionId: typeof raw.sessionId === "string" ? raw.sessionId : "",
    fingerprintHash:
      typeof raw.fingerprintHash === "string" ? raw.fingerprintHash : ""
  };
}

async function ensureStore() {
  if (!allowFileVoteStore()) {
    throw new Error("File vote store disabled");
  }

  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(voteFile, "utf8");
  } catch {
    await writeFile(voteFile, "[]", "utf8");
  }
}

async function readStoredVotesFromFile(): Promise<StoredVoteRecord[]> {
  await ensureStore();

  try {
    const raw = await readFile(voteFile, "utf8");
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => (item && typeof item === "object" ? mapStoredVote(item as Record<string, unknown>) : null))
      .filter((item): item is StoredVoteRecord => item !== null);
  } catch {
    return [];
  }
}

async function readVotesFromFile(): Promise<VoteRecord[]> {
  const votes = await readStoredVotesFromFile();
  return votes.map(toPublicVote);
}

async function appendVoteToFile(
  vote: VotePayload,
  context: InsertContext
): Promise<InsertResult> {
  const votes = await readStoredVotesFromFile();
  const duplicate = votes.some(
    (item) =>
      item.sessionId === context.sessionId ||
      item.fingerprintHash === context.fingerprintHash
  );

  if (duplicate) {
    return { duplicate: true };
  }

  const nextVote: StoredVoteRecord = {
    ...vote,
    timestamp: Date.now(),
    sessionId: context.sessionId,
    fingerprintHash: context.fingerprintHash
  };

  votes.push(nextVote);
  await writeFile(voteFile, JSON.stringify(votes, null, 2), "utf8");

  return {
    duplicate: false,
    vote: toPublicVote(nextVote)
  };
}

async function findSupabaseDuplicate(context: InsertContext) {
  const { url, key, table } = getSupabaseConfig();
  const params = new URLSearchParams({
    select: "id",
    or: `(session_id.eq.${context.sessionId},fingerprint_hash.eq.${context.fingerprintHash})`,
    limit: "1"
  });

  const response = await fetch(`${url}/rest/v1/${table}?${params.toString()}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Failed to check duplicate vote");
  }

  const rows = (await response.json()) as Array<{ id: number }>;
  return rows.length > 0;
}

async function readVotesFromSupabase(): Promise<VoteRecord[]> {
  const { url, key, table } = getSupabaseConfig();
  const response = await fetch(
    `${url}/rest/v1/${table}?select=candidate_id,issue,dusun,age_group,satisfaction,created_at&order=created_at.desc`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`
      },
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error("Failed to read Supabase votes");
  }

  const rows = (await response.json()) as Array<{
    candidate_id: string;
    issue: string;
    dusun: string;
    age_group: string;
    satisfaction: string;
    created_at: string;
  }>;

  return rows.map((row) => ({
    candidateId: row.candidate_id,
    issue: row.issue,
    dusun: row.dusun,
    ageGroup: row.age_group,
    satisfaction: row.satisfaction,
    timestamp: new Date(row.created_at).getTime()
  }));
}

async function appendVoteToSupabase(
  vote: VotePayload,
  context: InsertContext
): Promise<InsertResult> {
  const duplicate = await findSupabaseDuplicate(context);

  if (duplicate) {
    return { duplicate: true };
  }

  const { url, key, table } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=representation"
    },
    body: JSON.stringify({
      candidate_id: vote.candidateId,
      issue: vote.issue,
      dusun: vote.dusun,
      age_group: vote.ageGroup,
      satisfaction: vote.satisfaction,
      session_id: context.sessionId,
      fingerprint_hash: context.fingerprintHash
    })
  });

  if (!response.ok) {
    throw new Error("Failed to insert Supabase vote");
  }

  const [row] = (await response.json()) as Array<{
    candidate_id: string;
    issue: string;
    dusun: string;
    age_group: string;
    satisfaction: string;
    created_at: string;
  }>;

  return {
    duplicate: false,
    vote: {
      candidateId: row.candidate_id,
      issue: row.issue,
      dusun: row.dusun,
      ageGroup: row.age_group,
      satisfaction: row.satisfaction,
      timestamp: new Date(row.created_at).getTime()
    }
  };
}

export function createSessionId() {
  return randomUUID();
}

export function createFingerprint(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export async function readVotes(): Promise<VoteRecord[]> {
  if (hasSupabaseConfig()) {
    return readVotesFromSupabase();
  }

  if (!allowFileVoteStore()) {
    throw new Error("Vote store not configured");
  }

  return readVotesFromFile();
}

export async function appendVote(vote: VotePayload, context: InsertContext) {
  if (hasSupabaseConfig()) {
    return appendVoteToSupabase(vote, context);
  }

  if (!allowFileVoteStore()) {
    throw new Error("Vote store not configured");
  }

  return appendVoteToFile(vote, context);
}

export function getVoteStoreMode(): StoreMode {
  return hasSupabaseConfig() ? "supabase" : "file";
}
