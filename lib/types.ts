export interface Post {
  id: number;
  username: string;
  caption: string;
  imageUrl: string;
  likes: number;
  comments: number;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  level: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  participants: number;
  daysLeft: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  joinedDate: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}