import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { UserProfile } from '../lib/types';
import { useAuth } from '../lib/context/auth-context';
import * as FirestoreService from '../lib/services/firestore';

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const profile = await FirestoreService.getUserProfile(userId);
      
      if (!profile) {
        throw new Error('Profile not found. Please try signing out and signing in again.');
      }
      
      setProfile(profile);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching profile');
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }
    
    try {
      setError(null);
      await FirestoreService.updateUserProfile(user.uid, {
        ...data,
        updatedAt: new Date(),
      });
      // Update local state
      setProfile((prev) => prev ? { ...prev, ...data, updatedAt: new Date() } : null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating profile');
    }
  };

  const uploadProfileImage = async (file: File) => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }
    
    try {
      setError(null);
      const storageRef = ref(storage, `profile-images/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update profile with new image URL
      await updateProfile({ photoURL: downloadURL });
      return downloadURL;
    } catch (err) {
      console.error('Error uploading profile image:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while uploading profile image');
      return null;
    }
  };

  const getCompletedCourses = async () => {
    if (!user || !profile) return [];
    return profile.completedCourses;
  };

  const getCompletedChallenges = async () => {
    if (!user || !profile) return [];
    return profile.completedChallenges;
  };

  const getBadges = async () => {
    if (!user || !profile) return [];
    return profile.badges;
  };

  const getPoints = () => {
    return profile?.points || 0;
  };

  useEffect(() => {
    if (user) {
      fetchProfile(user.uid);
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadProfileImage,
    getCompletedCourses,
    getCompletedChallenges,
    getBadges,
    getPoints,
  };
}; 