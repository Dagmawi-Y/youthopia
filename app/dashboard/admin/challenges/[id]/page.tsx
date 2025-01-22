import { EditChallengeClient } from "./edit-challenge-client";

interface EditChallengePageProps {
  params: { id: string };
}

export default function EditChallengePage({ params }: EditChallengePageProps) {
  return <EditChallengeClient challengeId={params.id} />;
}
