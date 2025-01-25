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
  increment,
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
    role: data.role || "user",
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
    const currentUser = auth.currentUser;

    const isAvailable = await isUsernameAvailable(username);
    if (!isAvailable) {
      throw new Error("Username is already taken");
    }

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
      username: username.toLowerCase(),
      accountType: "child",
      role: "user",
      parentId,
      points: 0,
      completedCourses: [],
      completedChallenges: [],
      badges: [],
    });

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

export const addComment = async (
  postId: string,
  commentData: Omit<Comment, "id" | "createdAt" | "updatedAt">
) => {
  const commentsRef = collection(db, "posts", postId, "comments");
  const commentRef = doc(commentsRef);

  await setDoc(commentRef, {
    ...commentData,
    id: commentRef.id,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Update post's comment count
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    commentCount: increment(1),
    updatedAt: serverTimestamp(),
  });

  return commentRef.id;
};

export const getPostComments = async (postId: string) => {
  const commentsRef = collection(db, "posts", postId, "comments");
  const q = query(commentsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  })) as Comment[];
};

export const likePost = async (postId: string, userId: string) => {
  const postRef = doc(db, "posts", postId);
  const likeRef = doc(db, "posts", postId, "likes", userId);

  // Check if user has already liked
  const likeDoc = await getDoc(likeRef);

  if (likeDoc.exists()) {
    // Unlike if already liked
    await deleteDoc(likeRef);
    await updateDoc(postRef, {
      likeCount: increment(-1),
      updatedAt: serverTimestamp(),
    });
    return false; // Returned false means unliked
  } else {
    // Like if not already liked
    await setDoc(likeRef, {
      userId,
      createdAt: serverTimestamp(),
    });
    await updateDoc(postRef, {
      likeCount: increment(1),
      updatedAt: serverTimestamp(),
    });
    return true; // Returned true means liked
  }
};

export const getPostLikes = async (postId: string) => {
  const likesRef = collection(db, "posts", postId, "likes");
  const snapshot = await getDocs(likesRef);
  return snapshot.docs.map((doc) => doc.id); // Returns array of userIds who liked
};

export const createPost = async (
  data: Omit<
    Post,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "likes"
    | "comments"
    | "likeCount"
    | "commentCount"
  >
) => {
  const postsRef = collection(db, "posts");
  const postRef = doc(postsRef);

  await setDoc(postRef, {
    ...data,
    id: postRef.id,
    likeCount: 0,
    commentCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return postRef.id;
};

export const getPost = async (postId: string) => {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) return null;

  // Get comments and likes in parallel
  const [comments, likes] = await Promise.all([
    getPostComments(postId),
    getPostLikes(postId),
  ]);

  const data = postSnap.data();
  return {
    ...data,
    comments,
    likes,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Post;
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
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    // Get all posts first
    const posts = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }));

    // Then get comments and likes for each post in parallel
    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        const [comments, likes] = await Promise.all([
          getPostComments(post.id),
          getPostLikes(post.id),
        ]);
        return {
          ...post,
          comments,
          likes,
        };
      })
    );

    return postsWithDetails as Post[];
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

// Course Topics Management
export const createTopic = async (name: string, description?: string) => {
  const topicsRef = collection(db, "courseTopics");
  const topicDoc = doc(topicsRef);
  await setDoc(topicDoc, {
    id: topicDoc.id,
    name,
    description: description || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return topicDoc.id;
};

export const getAllTopics = async () => {
  const topicsRef = collection(db, "courseTopics");
  const q = query(topicsRef, orderBy("name"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateTopic = async (
  topicId: string,
  data: { name?: string; description?: string }
) => {
  const topicRef = doc(db, "courseTopics", topicId);
  await updateDoc(topicRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTopic = async (topicId: string) => {
  const topicRef = doc(db, "courseTopics", topicId);
  await deleteDoc(topicRef);
};
