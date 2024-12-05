import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  arrayUnion,
  arrayRemove,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import type {
  UserProfile,
  Post,
  Comment,
  Course,
  Challenge,
  Badge,
} from '../types';

// User Profile Operations
export const createUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, 'users', uid);
  const profileData = {
    ...data,
    points: data.points || 0,
    completedCourses: data.completedCourses || [],
    completedChallenges: data.completedChallenges || [],
    badges: data.badges || [],
    bio: data.bio || '',
    photoURL: data.photoURL || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // Remove any undefined values
  Object.keys(profileData).forEach(key => {
    if (profileData[key] === undefined) {
      delete profileData[key];
    }
  });

  await setDoc(userRef, profileData);
};

export const getUserProfile = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      console.error('No profile found for user:', uid);
      return null;
    }
    
    const data = userSnap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, 'users', uid);
  
  // Remove any undefined values
  const updateData = { ...data };
  Object.keys(updateData).forEach(key => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });

  await updateDoc(userRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
};

// Post Operations
export const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'comments'>) => {
  const postsRef = collection(db, 'posts');
  const postRef = doc(postsRef);
  await setDoc(postRef, {
    ...data,
    id: postRef.id,
    likes: [],
    comments: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return postRef.id;
};

export const getPost = async (postId: string) => {
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  
  if (!postSnap.exists()) return null;
  
  const data = postSnap.data();
  return {
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    comments: data.comments.map((comment: any) => ({
      ...comment,
      createdAt: comment.createdAt?.toDate(),
      updatedAt: comment.updatedAt?.toDate(),
    })),
  } as Post;
};

export const likePost = async (postId: string, userId: string) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    likes: arrayUnion(userId),
    updatedAt: serverTimestamp(),
  });
};

export const unlikePost = async (postId: string, userId: string) => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    likes: arrayRemove(userId),
    updatedAt: serverTimestamp(),
  });
};

export const addComment = async (postId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => {
  const postRef = doc(db, 'posts', postId);
  const commentId = Math.random().toString(36).substr(2, 9);
  const newComment = {
    ...comment,
    id: commentId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await updateDoc(postRef, {
    comments: arrayUnion(newComment),
    updatedAt: serverTimestamp(),
  });
  return commentId;
};

// Course Operations
export const createCourse = async (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => {
  const coursesRef = collection(db, 'courses');
  const courseRef = doc(coursesRef);
  await setDoc(courseRef, {
    ...data,
    id: courseRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return courseRef.id;
};

export const getCourse = async (courseId: string) => {
  const courseRef = doc(db, 'courses', courseId);
  const courseSnap = await getDoc(courseRef);
  return courseSnap.exists() ? courseSnap.data() as Course : null;
};

export const completeCourse = async (userId: string, courseId: string) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    completedCourses: arrayUnion(courseId),
    updatedAt: serverTimestamp(),
  });
};

// Challenge Operations
export const createChallenge = async (data: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt' | 'participants' | 'winners'>) => {
  const challengesRef = collection(db, 'challenges');
  const challengeRef = doc(challengesRef);
  await setDoc(challengeRef, {
    ...data,
    id: challengeRef.id,
    participants: [],
    winners: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return challengeRef.id;
};

export const getChallenge = async (challengeId: string) => {
  const challengeRef = doc(db, 'challenges', challengeId);
  const challengeSnap = await getDoc(challengeRef);
  return challengeSnap.exists() ? challengeSnap.data() as Challenge : null;
};

export const joinChallenge = async (challengeId: string, userId: string) => {
  const challengeRef = doc(db, 'challenges', challengeId);
  await updateDoc(challengeRef, {
    participants: arrayUnion(userId),
    updatedAt: serverTimestamp(),
  });
};

export const completeChallenge = async (userId: string, challengeId: string) => {
  const userRef = doc(db, 'users', userId);
  const challengeRef = doc(db, 'challenges', challengeId);
  
  await Promise.all([
    updateDoc(userRef, {
      completedChallenges: arrayUnion(challengeId),
      updatedAt: serverTimestamp(),
    }),
    updateDoc(challengeRef, {
      winners: arrayUnion(userId),
      updatedAt: serverTimestamp(),
    }),
  ]);
};

// Badge Operations
export const awardBadge = async (userId: string, badgeId: string) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    badges: arrayUnion(badgeId),
    updatedAt: serverTimestamp(),
  });
}; 