"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/context/auth-context";
import {
  getUserProfileByUsername,
  getFriendStatus,
  sendFriendRequest,
  getFriendRequests,
  respondToFriendRequest,
  updateUserProfile,
} from "@/lib/services/firestore";
import { UserProfile, FriendRequest } from "@/lib/types";

interface PageProps {
  params: Promise<{
    username: string;
  }>;
}

export default function UserProfilePage({ params }: PageProps) {
  const { username } = use(params);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friendStatus, setFriendStatus] = useState<
    FriendRequest | null | { status: string }
  >(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setBio(profile.bio || "");
    }
  }, [profile]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getUserProfileByUsername(username);
        if (!userProfile) {
          setError("User not found");
          return;
        }
        setProfile(userProfile);

        // If logged in user is viewing someone else's profile
        if (user && user.uid !== userProfile.uid) {
          const status = await getFriendStatus(user.uid, userProfile.uid);
          setFriendStatus(status);
        }

        // If logged in user is viewing their own profile
        if (user && user.uid === userProfile.uid) {
          const requests = await getFriendRequests(user.uid);
          setFriendRequests(requests);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, user]);

  const handleSendFriendRequest = async () => {
    if (!user || !profile) return;
    try {
      await sendFriendRequest(user.uid, profile.uid);
      setFriendStatus({
        id: `${user.uid}_${profile.uid}`,
        fromUserId: user.uid,
        toUserId: profile.uid,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (err) {
      console.error("Failed to send friend request:", err);
    }
  };

  const handleRespondToRequest = async (
    requestId: string,
    response: "accepted" | "rejected"
  ) => {
    try {
      await respondToFriendRequest(requestId, response);
      setFriendRequests((prev) => prev.filter((req) => req.id !== requestId));
      if (response === "accepted") {
        setFriendStatus({ status: "accepted" });
      }
    } catch (err) {
      console.error("Failed to respond to friend request:", err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (selectedImage) {
        URL.revokeObjectURL(URL.createObjectURL(selectedImage));
      }
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    try {
      // TODO: Implement image upload
      await updateUserProfile(user.uid, {
        displayName,
        bio,
      });

      setProfile((prev) => (prev ? { ...prev, displayName, bio } : null));
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleCancel = () => {
    if (selectedImage) {
      URL.revokeObjectURL(URL.createObjectURL(selectedImage));
      setSelectedImage(null);
    }
    setIsEditing(false);
    if (profile) {
      setDisplayName(profile.displayName);
      setBio(profile.bio || "");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          {error || "User not found"}
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.uid === profile.uid;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={profile.photoURL || "/images/default-avatar.svg"}
                    alt={profile.displayName}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.displayName}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    @{profile.username}
                  </p>
                </div>
              </div>
              {isOwnProfile ? (
                <button
                  onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </button>
              ) : (
                user && (
                  <div>
                    {!friendStatus && (
                      <button
                        onClick={handleSendFriendRequest}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                      >
                        Send Friend Request
                      </button>
                    )}
                    {friendStatus?.status === "pending" && (
                      <span className="text-gray-600 dark:text-gray-400">
                        Friend Request Pending
                      </span>
                    )}
                    {friendStatus?.status === "accepted" && (
                      <span className="text-green-600 dark:text-green-400">
                        Friends
                      </span>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="space-y-8">
              {/* Bio Section */}
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-medium
                        file:bg-primary file:text-white
                        hover:file:cursor-pointer hover:file:bg-primary/90"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Bio
                  </h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {profile.bio || "No bio yet"}
                  </p>
                </div>
              )}

              {/* Friend Requests Section (only shown on own profile) */}
              {isOwnProfile && friendRequests.length > 0 && !isEditing && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Friend Requests
                  </h2>
                  <div className="space-y-4">
                    {friendRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            From: {request.fromUserId}
                          </p>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() =>
                              handleRespondToRequest(request.id, "accepted")
                            }
                            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleRespondToRequest(request.id, "rejected")
                            }
                            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Section */}
              {!isEditing && (
                <>
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      Stats
                    </h2>
                    <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-4">
                      <div className="px-4 py-5 bg-gray-50 dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Points Earned
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                          {profile.points}
                        </dd>
                      </div>
                      <div className="px-4 py-5 bg-gray-50 dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Friends
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                          {profile.friends?.length || 0}
                        </dd>
                      </div>
                      <div className="px-4 py-5 bg-gray-50 dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Courses Completed
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                          {profile.completedCourses.length}
                        </dd>
                      </div>
                      <div className="px-4 py-5 bg-gray-50 dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Challenges Won
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                          {profile.completedChallenges.length}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Badges Section */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                      Badges
                    </h2>
                    <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {profile.badges.map((badge) => (
                        <div
                          key={badge}
                          className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg"
                        >
                          <div className="w-16 h-16 relative">
                            <Image
                              src={`/badges/${badge}.png`}
                              alt={badge}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
