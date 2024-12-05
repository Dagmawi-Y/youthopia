"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/context/auth-context';
import { useProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();
  const {
    profile,
    loading: profileLoading,
    error: profileError,
    updateProfile,
    uploadProfileImage,
    getCompletedCourses,
    getCompletedChallenges,
    getBadges,
    getPoints,
  } = useProfile();

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    }
  }, [user, router]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setBio(profile.bio || '');
    }
  }, [profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let photoURL = profile?.photoURL;

      if (selectedImage) {
        photoURL = await uploadProfileImage(selectedImage);
      }

      await updateProfile({
        displayName,
        bio,
        photoURL,
      });

      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">Error loading profile</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={profile?.photoURL || '/default-avatar.png'}
                    alt={profile?.displayName || 'Profile'}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile?.displayName}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">{profile?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

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

                {error && (
                  <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
                    <div className="flex">
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                          Error
                        </h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                          {error}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Bio</h2>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">
                    {profile?.bio || 'No bio yet'}
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Stats</h2>
                  <dl className="mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="px-4 py-5 bg-gray-50 dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Points Earned
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        {getPoints()}
                      </dd>
                    </div>
                    <div className="px-4 py-5 bg-gray-50 dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Courses Completed
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        {profile?.completedCourses.length || 0}
                      </dd>
                    </div>
                    <div className="px-4 py-5 bg-gray-50 dark:bg-gray-900 shadow rounded-lg overflow-hidden sm:p-6">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        Challenges Won
                      </dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                        {profile?.completedChallenges.length || 0}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Badges</h2>
                  <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {profile?.badges.map((badge) => (
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}