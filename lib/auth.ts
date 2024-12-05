"use client";

import Cookies from 'js-cookie';
import { User } from "./types";

const AUTH_TOKEN_KEY = 'auth_token';
const USER_KEY = 'current_user';

const isBrowser = typeof window !== 'undefined';

class AuthService {
  private user: User | null = null;

  constructor() {
    if (isBrowser) {
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedUser) {
        this.user = JSON.parse(savedUser);
      }
    }
  }

  getCurrentUser(): User | null {
    return this.user;
  }

  async register(userData: { username: string; email: string; password: string }): Promise<User> {
    try {
      const mockUser: User = {
        uid: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        displayName: userData.username,
        photoURL: `https://api.dicebear.com/7.x/avatars/svg?seed=${userData.username}`,
      };

      this.user = mockUser;
      if (isBrowser) {
        localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
        Cookies.set(AUTH_TOKEN_KEY, 'mock-token', { expires: 7 });
      }

      return mockUser;
    } catch (error) {
      throw new Error('Registration failed');
    }
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const mockUser: User = {
        uid: '1',
        email,
        displayName: email.split('@')[0],
        photoURL: `https://api.dicebear.com/7.x/avatars/svg?seed=${email}`,
      };

      this.user = mockUser;
      if (isBrowser) {
        localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
        Cookies.set(AUTH_TOKEN_KEY, 'mock-token', { expires: 7 });
      }

      return mockUser;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  logout(): void {
    this.user = null;
    if (isBrowser) {
      localStorage.removeItem(USER_KEY);
      Cookies.remove(AUTH_TOKEN_KEY);
    }
  }

  isAuthenticated(): boolean {
    if (!isBrowser) return false;
    return !!Cookies.get(AUTH_TOKEN_KEY) && !!this.user;
  }
}

export const auth = new AuthService();