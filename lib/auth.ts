"use client";

import { User } from "./types";

// Mock user data
export const MOCK_USERS: User[] = [
  {
    id: "1",
    username: "demo_user",
    email: "demo@example.com",
    password: "demo123",
    avatar: "https://i.pravatar.cc/150?img=1",
    bio: "Demo account for testing",
    joinedDate: new Date("2024-01-01"),
  },
];

// In-memory storage for users
let users = [...MOCK_USERS];
let currentUser: User | null = null;

export const auth = {
  register: async (userData: { username: string; email: string; password: string }) => {
    const existingUser = users.find(
      (u) => u.email === userData.email || u.username === userData.username
    );
    
    if (existingUser) {
      throw new Error("User already exists");
    }

    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      joinedDate: new Date(),
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
      bio: "",
    };

    users.push(newUser);
    currentUser = newUser;
    return newUser;
  },

  login: async (email: string, password: string) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    currentUser = user;
    return user;
  },

  logout: () => {
    currentUser = null;
  },

  getCurrentUser: () => {
    return currentUser;
  },

  getAllUsers: () => {
    return users;
  },
};