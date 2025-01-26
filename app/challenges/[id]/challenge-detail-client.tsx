"use client";

import { useEffect, useState } from "react";
import { Challenge, Post } from "@/lib/types";
import { useChallenges } from "@/hooks/useChallenges";
import { useAuth } from "@/lib/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { CreatePostDialog } from "@/components/shared/create-post-dialog";
import { usePosts } from "@/hooks/usePosts";
import { ContentCard } from "@/components/shared/content-card";
import { Timestamp } from "firebase/firestore";

// Helper function to safely format timestamp
const formatTimestamp = (timestamp: Date | Timestamp | undefined): string => {
  if (!timestamp) return "";

  // If it's a Firestore Timestamp, convert to Date
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toLocaleDateString();
  }

  // If it's already a Date
  if (timestamp instanceof Date) {
    return timestamp.toLocaleDateString();
  }

  return "";
};

interface ChallengeDetailClientProps {
  challengeId: string;
}

export function ChallengeDetailClient({
  challengeId,
}: ChallengeDetailClientProps) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submissions, setSubmissions] = useState<Post[]>([]);

  const { getChallenge, joinChallenge } = useChallenges();
  const { user } = useAuth();
  const router = useRouter();
  const { posts, loading: postsLoading } = usePosts();

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const challengeData = await getChallenge(challengeId);
        if (!challengeData) {
          setError("Challenge not found");
          return;
        }
        setChallenge(challengeData);

        // Filter posts related to this challenge
        const challengePosts = posts.filter((post) =>
          post.tags?.includes(`challenge-${challengeId}`)
        );
        setSubmissions(challengePosts);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load challenge"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();
  }, [challengeId, getChallenge, posts]);

  const handleJoinChallenge = async () => {
    if (!user || !challenge) return;

    try {
      await joinChallenge(challengeId);
      // Refresh challenge data
      const updatedChallenge = await getChallenge(challengeId);
      setChallenge(updatedChallenge);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join challenge");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">
          {error || "Challenge not found"}
        </div>
      </div>
    );
  }

  const hasJoined = challenge.participants.includes(user?.uid || "");
  const hasSubmitted = submissions.some((post) => post.authorId === user?.uid);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Challenge Header */}
      <div className="mb-8">
        <div className="relative h-64 rounded-xl overflow-hidden mb-6">
          <img
            src={challenge.imageURL || "/placeholder-challenge.jpg"}
            alt={challenge.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              {challenge.title}
            </h1>
            <p className="text-white/90">{challenge.description}</p>
          </div>
        </div>

        {/* Challenge Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <h3 className="text-lg font-semibold mb-1">Participants</h3>
            <p className="text-2xl text-[#7BD3EA]">
              {challenge.participants.length}
            </p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="text-lg font-semibold mb-1">Points</h3>
            <p className="text-2xl text-[#7BD3EA]">{challenge.points}</p>
          </Card>
          <Card className="p-4 text-center">
            <h3 className="text-lg font-semibold mb-1">Submissions</h3>
            <p className="text-2xl text-[#7BD3EA]">{submissions.length}</p>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {!hasJoined ? (
            <Button
              onClick={handleJoinChallenge}
              className="bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black px-8"
            >
              Join Challenge
            </Button>
          ) : !hasSubmitted ? (
            <Button
              onClick={() => setShowSubmitDialog(true)}
              className="bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black px-8"
            >
              Submit Solution
            </Button>
          ) : (
            <Button disabled className="bg-gray-200 text-gray-600 px-8">
              Already Submitted
            </Button>
          )}
        </div>
      </div>

      {/* Submissions Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Submissions</h2>
        {submissions.length > 0 ? (
          <div className="grid gap-6">
            {submissions.map((post) => (
              <div key={post.id} className="w-full">
                <ContentCard
                  id={post.id}
                  username={post.authorName}
                  userAvatar={post.authorPhotoURL}
                  content={post.content}
                  mediaUrl={post.mediaURL}
                  mediaType={post.mediaType}
                  likes={post.likes}
                  commentCount={post.commentCount}
                  timestamp={formatTimestamp(post.createdAt)}
                  challengeId={challengeId}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No submissions yet. Be the first one to submit!
          </div>
        )}
      </div>

      {/* Submit Dialog */}
      <CreatePostDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        challengeId={challengeId}
        defaultTags={[`challenge-${challengeId}`]}
        onSuccess={() => {
          setShowSubmitDialog(false);
          router.refresh();
        }}
      />
    </div>
  );
}
