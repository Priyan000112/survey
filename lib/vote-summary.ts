import { candidates } from "@/data/candidates";
import { issues } from "@/data/issues";
import type { StatBucket, VoteRecord, VoteSummary } from "@/lib/types";

function aggregate(values: string[], allLabels: string[]): StatBucket[] {
  const counts = new Map<string, number>();

  allLabels.forEach((label) => counts.set(label, 0));
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));

  return Array.from(counts.entries()).map(([label, count]) => ({ label, count }));
}

function sortBuckets(items: StatBucket[]) {
  return [...items].sort((left, right) => right.count - left.count);
}

export function createVoteSummary(votes: VoteRecord[]): VoteSummary {
  const candidateStats = sortBuckets(
    candidates.map((candidate) => ({
      label: candidate.name,
      count: votes.filter((vote) => vote.candidateId === candidate.id).length
    }))
  );

  const issueStats = sortBuckets(
    aggregate(
      votes.map((vote) => vote.issue),
      issues.map((issue) => issue.label)
    )
  );

  const dusunStats = sortBuckets(
    aggregate(votes.map((vote) => vote.dusun), [
      "Dusun 1",
      "Dusun 2",
      "Dusun 3",
      "Luar Maribaya"
    ])
  );

  const ageStats = sortBuckets(
    aggregate(votes.map((vote) => vote.ageGroup), [
      "17-25",
      "26-35",
      "36-50",
      "50+"
    ])
  );

  const satisfactionStats = sortBuckets(
    aggregate(votes.map((vote) => vote.satisfaction), [
      "Sangat puas",
      "Cukup puas",
      "Kurang puas",
      "Tidak puas"
    ])
  );

  return {
    totalVotes: votes.length,
    leader: candidateStats[0]?.label ?? "-",
    topIssue: issueStats[0]?.label ?? "-",
    candidateStats,
    issueStats,
    dusunStats,
    ageStats,
    satisfactionStats
  };
}
