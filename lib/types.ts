export type Candidate = {
  id: string;
  name: string;
  initials: string;
  category: string;
  tags: string[];
  description: string;
};

export type VoteRecord = {
  candidateId: string;
  issue: string;
  dusun: string;
  ageGroup: string;
  satisfaction: string;
  timestamp: number;
};

export type VotePayload = Omit<VoteRecord, "timestamp">;

export type StatBucket = {
  label: string;
  count: number;
};

export type VoteSummary = {
  totalVotes: number;
  leader: string;
  topIssue: string;
  candidateStats: StatBucket[];
  issueStats: StatBucket[];
  dusunStats: StatBucket[];
  ageStats: StatBucket[];
  satisfactionStats: StatBucket[];
};

export type VoteSubmitResult = {
  saved: boolean;
  storageAvailable: boolean;
  duplicate: boolean;
  message?: string;
  mode?: "file" | "supabase";
};
