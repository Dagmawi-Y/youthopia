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
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import type {
  UserProfile,
  Post,
  Comment,
  Course,
  Challenge,
  Badge,
} from "../types";

// Export Firestore array operations
export { arrayUnion, arrayRemove };

// User Profile Operations
export const createUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
) => {
  const userRef = doc(db, "users", uid);
  const profileData = {
    ...data,
    points: data.points || 0,
    completedCourses: data.completedCourses || [],
    completedChallenges: data.completedChallenges || [],
    badges: data.badges || [],
    bio: data.bio || "",
    photoURL: data.photoURL || null,
    accountType: data.accountType || "parent",
    childAccounts: data.childAccounts || [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  // Remove any undefined values
  Object.keys(profileData).forEach((key) => {
    if (profileData[key as keyof typeof profileData] === undefined) {
      delete profileData[key as keyof typeof profileData];
    }
  });

  await setDoc(userRef, profileData);
};

// Create a child account
export const createChildAccount = async (
  username: string,
  password: string,
  parentId: string
) => {
  try {
    // Create auth account with a generated email
    const email = `${username.toLowerCase()}_${Math.random()
      .toString(36)
      .substring(2)}@youthopia.internal`;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const childUid = userCredential.user.uid;

    // Create child profile
    await createUserProfile(childUid, {
      uid: childUid,
      email,
      displayName: username,
      username,
      accountType: "child",
      parentId,
      points: 0,
      completedCourses: [],
      completedChallenges: [],
      badges: [],
    });

    return userCredential.user;
  } catch (error) {
    console.error("Error creating child account:", error);
    throw error;
  }
};

// Get child accounts for a parent
export const getChildAccounts = async (parentId: string) => {
  try {
    const q = query(
      collection(db, "users"),
      where("parentId", "==", parentId),
      where("accountType", "==", "child")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as UserProfile);
  } catch (error) {
    console.error("Error getting child accounts:", error);
    throw error;
  }
};

export const getUserProfile = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("No profile found for user:", uid);
      return null;
    }

    const data = userSnap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as UserProfile;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  uid: string,
  data: Partial<UserProfile>
) => {
  const userRef = doc(db, "users", uid);

  // Remove any undefined values
  const updateData = { ...data };
  Object.keys(updateData).forEach((key) => {
    if (updateData[key as keyof typeof updateData] === undefined) {
      delete updateData[key as keyof typeof updateData];
    }
  });

  await updateDoc(userRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
};

// Post Operations
export const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "likes" | "comments">
) => {
  const postsRef = collection(db, "posts");
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
  const postRef = doc(db, "posts", postId);
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
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likes: arrayUnion(userId),
    updatedAt: serverTimestamp(),
  });
};

export const unlikePost = async (postId: string, userId: string) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likes: arrayRemove(userId),
    updatedAt: serverTimestamp(),
  });
};

export const addComment = async (
  postId: string,
  comment: Omit<Comment, "id" | "createdAt" | "updatedAt">
) => {
  const postRef = doc(db, "posts", postId);
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
export const createCourse = async (
  data: Omit<Course, "id" | "createdAt" | "updatedAt">
) => {
  const coursesRef = collection(db, "courses");
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
  const courseRef = doc(db, "courses", courseId);
  const courseSnap = await getDoc(courseRef);
  return courseSnap.exists() ? (courseSnap.data() as Course) : null;
};

export const completeCourse = async (userId: string, courseId: string) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    completedCourses: arrayUnion(courseId),
    updatedAt: serverTimestamp(),
  });
};

// Challenge Operations
export const createChallenge = async (
  data: Omit<
    Challenge,
    "id" | "createdAt" | "updatedAt" | "participants" | "winners"
  >
) => {
  const challengesRef = collection(db, "challenges");
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
  const challengeRef = doc(db, "challenges", challengeId);
  const challengeSnap = await getDoc(challengeRef);
  return challengeSnap.exists() ? (challengeSnap.data() as Challenge) : null;
};

export const joinChallenge = async (challengeId: string, userId: string) => {
  const challengeRef = doc(db, "challenges", challengeId);
  await updateDoc(challengeRef, {
    participants: arrayUnion(userId),
    updatedAt: serverTimestamp(),
  });
};

export const completeChallenge = async (
  userId: string,
  challengeId: string
) => {
  const userRef = doc(db, "users", userId);
  const challengeRef = doc(db, "challenges", challengeId);

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
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    badges: arrayUnion(badgeId),
    updatedAt: serverTimestamp(),
  });
};

// Update parent's child accounts
export const updateParentChildAccounts = async (
  parentId: string,
  childId: string
) => {
  const userRef = doc(db, "users", parentId);
  await updateDoc(userRef, {
    childAccounts: arrayUnion(childId),
    updatedAt: serverTimestamp(),
  });
};

// Delete user profile
export const deleteUserProfile = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw error;
  }
};

// Remove child from parent's childAccounts
export const removeChildFromParent = async (
  parentId: string,
  childId: string
) => {
  try {
    const userRef = doc(db, "users", parentId);
    await updateDoc(userRef, {
      childAccounts: arrayRemove(childId),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error removing child from parent:", error);
    throw error;
  }
};
