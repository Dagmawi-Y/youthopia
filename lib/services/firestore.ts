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
  onSnapshot,
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

export { arrayUnion, arrayRemove, serverTimestamp };

export const onUserProfileChange = (
  uid: string,
  callback: (profile: UserProfile | null) => void
) => {
  const userRef = doc(db, "users", uid);
  return onSnapshot(userRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as UserProfile);
    } else {
      callback(null);
    }
  });
};

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
    notificationSettings: data.notificationSettings || {
      emailNotifications: true,
      challengeUpdates: true,
      friendActivity: true,
    },
    privacySettings: data.privacySettings || {
      profileVisibility: "public",
      activitySharing: "everyone",
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  Object.keys(profileData).forEach((key) => {
    if (profileData[key as keyof typeof profileData] === undefined) {
      delete profileData[key as keyof typeof profileData];
    }
  });

  await setDoc(userRef, profileData);
};

export const isUsernameAvailable = async (
  username: string
): Promise<boolean> => {
  try {
    const q = query(
      collection(db, "users"),
      where("username", "==", username.toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error("Error checking username availability:", error);
    throw error;
  }
};

export const createChildAccount = async (
  username: string,
  password: string,
  parentId: string
) => {
  try {
    // Store the current user
    const currentUser = auth.currentUser;

    // Check username availability
    const isAvailable = await isUsernameAvailable(username);
    if (!isAvailable) {
      throw new Error("Username is already taken");
    }

    // Create account with username as email prefix (no random string needed)
    const email = `${username.toLowerCase()}@youthopia.internal`;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const childUid = userCredential.user.uid;

    await createUserProfile(childUid, {
      uid: childUid,
      email,
      displayName: username,
      username: username.toLowerCase(), // Store username in lowercase for consistency
      accountType: "child",
      parentId,
      points: 0,
      completedCourses: [],
      completedChallenges: [],
      badges: [],
    });

    // Sign back in as the parent
    if (currentUser) {
      await auth.updateCurrentUser(currentUser);
    }

    return userCredential.user;
  } catch (error) {
    console.error("Error creating child account:", error);
    throw error;
  }
};

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
  console.log({ uid });
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

export const createCourse = async (courseData: Course) => {
  try {
    const courseRef = doc(collection(db, "courses"));
    const courseWithTimestamps = {
      ...courseData,
      id: courseRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(courseRef, courseWithTimestamps);
    return courseRef.id;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
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
  try {
    const challengeRef = doc(db, "challenges", challengeId);
    const challengeSnap = await getDoc(challengeRef);

    if (!challengeSnap.exists()) {
      return null;
    }

    const data = challengeSnap.data();
    return {
      ...data,
      id: challengeSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      deadline: data.deadline,
    } as Challenge;
  } catch (error) {
    console.error("Error getting challenge:", error);
    throw error;
  }
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

export const awardBadge = async (userId: string, badgeId: string) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    badges: arrayUnion(badgeId),
    updatedAt: serverTimestamp(),
  });
};

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

export const deleteUserProfile = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
  } catch (error) {
    console.error("Error deleting user profile:", error);
    throw error;
  }
};

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

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as UserProfile[];
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "courses"));
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Course[];
  } catch (error) {
    console.error("Error getting all courses:", error);
    throw error;
  }
};

export const getAllChallenges = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "challenges"));
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    })) as Challenge[];
  } catch (error) {
    console.error("Error getting all challenges:", error);
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "posts"));
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
      comments: doc.data().comments.map((comment: any) => ({
        ...comment,
        createdAt: comment.createdAt?.toDate(),
        updatedAt: comment.updatedAt?.toDate(),
      })),
    })) as Post[];
  } catch (error) {
    console.error("Error getting all posts:", error);
    throw error;
  }
};

export const deleteCourse = async (courseId: string) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    await deleteDoc(courseRef);
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

export const deleteChallenge = async (challengeId: string) => {
  try {
    const challengeRef = doc(db, "challenges", challengeId);
    await deleteDoc(challengeRef);
  } catch (error) {
    console.error("Error deleting challenge:", error);
    throw error;
  }
};

export const updateCourse = async (
  courseId: string,
  courseData: Partial<Course>
) => {
  try {
    const courseRef = doc(db, "courses", courseId);
    const updateData = { ...courseData, updatedAt: serverTimestamp() };
    await updateDoc(courseRef, updateData);
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

export const getAllBadges = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "badges"));
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Badge[];
  } catch (error) {
    console.error("Error getting all badges:", error);
    throw error;
  }
};

export const removeBadge = async (userId: string, badgeId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      badges: arrayRemove(badgeId),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error removing badge:", error);
    throw error;
  }
};

export const updateChallenge = async (
  challengeId: string,
  data: Partial<Challenge>
) => {
  const challengeRef = doc(db, "challenges", challengeId);

  const updateData = { ...data };
  Object.keys(updateData).forEach((key) => {
    if (updateData[key as keyof typeof updateData] === undefined) {
      delete updateData[key as keyof typeof updateData];
    }
  });

  await updateDoc(challengeRef, {
    ...updateData,
    updatedAt: serverTimestamp(),
  });
};
