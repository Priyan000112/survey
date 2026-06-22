import { NextRequest, NextResponse } from "next/server";
import {
  appendVote,
  createFingerprint,
  createSessionId,
  getVoteStoreMode,
  readVotes
} from "@/lib/vote-store";
import { createVoteSummary } from "@/lib/vote-summary";
import type { VotePayload } from "@/lib/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Simple in-memory rate limiter: max 5 POST per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  if (entry.count >= 5) {
    return true;
  }

  entry.count++;
  return false;
}

function isValidVote(payload: Partial<VotePayload>) {
  return Boolean(
    payload.candidateId &&
      payload.issue &&
      payload.dusun &&
      payload.ageGroup &&
      payload.satisfaction
  );
}

export async function GET() {
  try {
    const votes = await readVotes();
    const summary = createVoteSummary(votes);

    return NextResponse.json(
      { summary, mode: getVoteStoreMode() },
      {
        headers: {
          "Cache-Control": "no-store"
        }
      }
    );
  } catch {
    return NextResponse.json(
      {
        summary: createVoteSummary([]),
        mode: getVoteStoreMode(),
        message: "Vote store belum dikonfigurasi."
      },
      { status: 503 }
    );
  }
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return request.ip || "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          saved: false,
          duplicate: false,
          storageAvailable: true,
          message: "Terlalu banyak percobaan. Coba lagi dalam 1 menit."
        },
        { status: 429 }
      );
    }

    const payload = (await request.json()) as Partial<VotePayload>;

    if (!isValidVote(payload)) {
      return NextResponse.json(
        {
          saved: false,
          duplicate: false,
          storageAvailable: true,
          message: "Data survei belum lengkap."
        },
        { status: 400 }
      );
    }

    const sessionId = request.cookies.get("svm_sid")?.value || createSessionId();
    const userAgent = request.headers.get("user-agent") || "unknown";
    const fingerprintHash = createFingerprint(`${clientIp}|${userAgent}`);

    const result = await appendVote(
      {
        candidateId: payload.candidateId!,
        issue: payload.issue!,
        dusun: payload.dusun!,
        ageGroup: payload.ageGroup!,
        satisfaction: payload.satisfaction!
      },
      {
        sessionId,
        fingerprintHash
      }
    );

    const response = NextResponse.json({
      saved: !result.duplicate,
      duplicate: result.duplicate,
      storageAvailable: true,
      mode: getVoteStoreMode(),
      message: result.duplicate
        ? "Suara dari perangkat atau jaringan ini sudah pernah tercatat."
        : undefined
    });

    response.cookies.set("svm_sid", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });

    return response;
  } catch {
    return NextResponse.json(
      {
        saved: false,
        duplicate: false,
        storageAvailable: true,
        message: "Server gagal menyimpan suara."
      },
      { status: 500 }
    );
  }
}
