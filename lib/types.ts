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
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhotoURL?: string;
  content: string;
  imageURL?: string;
  likes: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
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
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  points: number;
  createdAt: Date;
  updatedAt: Date;
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
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  deadline?: Date;
  participants: string[];
  winners: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  imageURL: string;
  criteria: string;
  points: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}