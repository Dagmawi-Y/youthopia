import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  points: number;
  completedCourses: string[];
  completedChallenges: string[];
  badges: string[];
  accountType: "parent" | "child";
  role?: "admin" | "moderator" | "user";
  parentId?: string;
  childAccounts?: string[];
  username?: string;
  friends: string[];
  friendRequests: string[];
  courseProgress?: {
    [courseId: string]: {
      completedModules: boolean[];
    };
  };
  notificationSettings?: {
    emailNotifications: boolean;
    challengeUpdates: boolean;
    friendActivity: boolean;
  };
  privacySettings?: {
    profileVisibility: "public" | "friends";
    activitySharing: "everyone" | "friends";
  };
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  content: string;
  mediaURL?: string;
  mediaType?: "image" | "video";
  likes: string[];
  comments: Comment[];
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  tags: string[];
  challengeId?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  modules: CourseModule[];
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  points: number;
  createdAt: Date;
  updatedAt: Date;
  instructor: string;
  level: string;
  topics: string[];
  enrolledCount: number;
  rating: number;
  reviews: Review[];
}

export interface CourseModule {
  id: string;
  title: string;
  content: string;
  videoURL?: string;
  order: number;
  quiz?: Quiz;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
  passingScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  imageURL?: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  points: number;
  deadline?: Timestamp;
  participants: string[];
  winners: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  submissions: Submission[];
  topics?: string[];
}

export const getDaysLeft = (deadline?: Timestamp): number => {
  if (!deadline) return 0;
  const now = new Date();
  const deadlineDate = deadline.toDate();
  const diff = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export interface Submission {
  userId: string;
  userName: string;
  repositoryUrl: string;
  submittedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  criteria: {
    type: "points";
    threshold: number;
  };
  color: string;
}

export const BADGES: Badge[] = [
  {
    id: "novice-explorer",
    name: "Novice Explorer",
    description: "Just starting your learning journey",
    imageURL: "/badges/novice.svg",
    criteria: {
      type: "points",
      threshold: 0,
    },
    color: "#A8E6CF", // Light green
  },
  {
    id: "rising-star",
    name: "Rising Star",
    description: "Making great progress in your learning path",
    imageURL: "/badges/rising-star.svg",
    criteria: {
      type: "points",
      threshold: 100,
    },
    color: "#FFD3B6", // Light orange
  },
  {
    id: "knowledge-seeker",
    name: "Knowledge Seeker",
    description: "Actively participating and learning new skills",
    imageURL: "/badges/knowledge-seeker.svg",
    criteria: {
      type: "points",
      threshold: 500,
    },
    color: "#7BD3EA", // Light blue
  },
  {
    id: "achiever",
    name: "High Achiever",
    description: "Consistently excelling in challenges and courses",
    imageURL: "/badges/achiever.svg",
    criteria: {
      type: "points",
      threshold: 1000,
    },
    color: "#FF9AA2", // Light red
  },
  {
    id: "master-learner",
    name: "Master Learner",
    description: "Mastered multiple skills and inspired others",
    imageURL: "/badges/master.svg",
    criteria: {
      type: "points",
      threshold: 2000,
    },
    color: "#B39DDB", // Light purple
  },
];

// Helper function to get badges based on points
export const getUserBadges = (points: number): Badge[] => {
  return BADGES.filter((badge) => points >= badge.criteria.threshold);
};

// Helper function to get the next badge
export const getNextBadge = (points: number): Badge | null => {
  const nextBadge = BADGES.find((badge) => points < badge.criteria.threshold);
  return nextBadge || null;
};

// Helper function to get progress to next badge
export const getProgressToNextBadge = (points: number): number => {
  const nextBadge = getNextBadge(points);
  if (!nextBadge) return 100;

  const currentBadge = [...BADGES]
    .reverse()
    .find((badge) => points >= badge.criteria.threshold);

  const currentThreshold = currentBadge ? currentBadge.criteria.threshold : 0;
  const nextThreshold = nextBadge.criteria.threshold;

  return (
    ((points - currentThreshold) / (nextThreshold - currentThreshold)) * 100
  );
};

export interface Review {
  rating: number;
  content: string;
  userId: string;
  userName: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}
