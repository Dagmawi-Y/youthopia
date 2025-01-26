import { Metadata } from "next";
import { ChallengeDetailClient } from "./challenge-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Challenge Details | Youthopia",
  description: "View challenge details and submit your work",
};

export default async function ChallengePage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ChallengeDetailClient challengeId={resolvedParams.id} />;
}
