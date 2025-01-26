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
  criteria: string;
  points: number;
}

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
