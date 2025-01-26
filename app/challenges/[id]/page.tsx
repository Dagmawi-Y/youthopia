import { Metadata } from "next";
import { ChallengeDetailClient } from "./challenge-detail-client";

interface PageProps {
  params: {
    id: string;
  };
}

export const metadata: Metadata = {
  title: "Challenge Details | Youthopia",
  description: "View challenge details and submit your work",
};

export default function ChallengePage({ params }: PageProps) {
  return <ChallengeDetailClient challengeId={params.id} />;
}
