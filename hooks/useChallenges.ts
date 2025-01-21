import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Challenge } from "../lib/types";
import { useAuth } from "../lib/context/auth-context";
import * as FirestoreService from "../lib/services/firestore";

export const useChallenges = (limitCount = 10) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChallenge, setLastChallenge] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  const fetchChallenges = async (
    lastVisible?: any,
    filters?: { difficulty?: string; active?: boolean }
  ) => {
    try {
      setLoading(true);
      const challengesRef = collection(db, "challenges");
      let queryConstraints: any[] = [
        orderBy("createdAt", "desc"),
        limit(limitCount),
      ];

      if (lastVisible) {
        queryConstraints.push(startAfter(lastVisible));
      }

      if (filters?.difficulty) {
        queryConstraints.push(where("difficulty", "==", filters.difficulty));
      }

      if (filters?.active) {
        const now = new Date();
        queryConstraints.push(where("deadline", ">", now));
      }

      const q = query(challengesRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      const newChallenges: Challenge[] = [];

      querySnapshot.forEach((doc) => {
        newChallenges.push(doc.data() as Challenge);
      });

      if (!lastVisible) {
        setChallenges(newChallenges);
      } else {
        setChallenges((prev) => [...prev, ...newChallenges]);
      }

      setLastChallenge(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === limitCount);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching challenges"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadMore = (filters?: { difficulty?: string; active?: boolean }) => {
    if (lastChallenge) {
      fetchChallenges(lastChallenge, filters);
    }
  };

  const getChallenge = async (challengeId: string) => {
    try {
      const challenge = await FirestoreService.getChallenge(challengeId);
      return challenge;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching the challenge"
      );
      return null;
    }
  };

  const joinChallenge = async (challengeId: string) => {
    if (!user) return;

    try {
      await FirestoreService.joinChallenge(challengeId, user.uid);

      setChallenges((prevChallenges) =>
        prevChallenges.map((challenge) =>
          challenge.id === challengeId
            ? {
                ...challenge,
                participants: [...challenge.participants, user.uid],
              }
            : challenge
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while joining the challenge"
      );
    }
  };

  const completeChallenge = async (challengeId: string) => {
    if (!user) return;

    try {
      await FirestoreService.completeChallenge(user.uid, challengeId);

      setChallenges((prevChallenges) =>
        prevChallenges.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, winners: [...challenge.winners, user.uid] }
            : challenge
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while completing the challenge"
      );
    }
  };

  const getUserChallenges = async () => {
    if (!user) return [];

    try {
      const challengesRef = collection(db, "challenges");
      const q = query(
        challengesRef,
        where("participants", "array-contains", user.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const userChallenges: Challenge[] = [];

      querySnapshot.forEach((doc) => {
        userChallenges.push(doc.data() as Challenge);
      });

      return userChallenges;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching user challenges"
      );
      return [];
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  return {
    challenges,
    loading,
    error,
    hasMore,
    loadMore,
    getChallenge,
    joinChallenge,
    completeChallenge,
    getUserChallenges,
  };
};
