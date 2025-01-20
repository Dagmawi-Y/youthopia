"use client";
import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  getIdToken,
  UserCredential,
} from "firebase/auth";
import { auth } from "../firebase";
import * as FirestoreService from "../services/firestore";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Get the ID token and store it in cookies
        const token = await getIdToken(user);
        Cookies.set("fb_auth_token", token, { expires: 7 });

        // Skip routing as it's handled in sign-in/sign-up
      } else {
        // Remove the token when user is null
        Cookies.remove("fb_auth_token");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [router, isSigningUp]);

  const signUp = async (email: string, password: string) => {
    setIsSigningUp(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential;
    } finally {
      // Reset the flag after a short delay to allow the sign-up page to handle routing
      setTimeout(() => setIsSigningUp(false), 1000);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userProfile = await FirestoreService.getUserProfile(
        userCredential.user.uid
      );

      if (!userProfile) {
        throw new Error("User profile not found");
      }

      // Add a small delay and use router.replace for more forceful navigation
      setTimeout(() => {
        if (userProfile.accountType === "parent") {
          router.replace("/dashboard/parent");
        } else {
          router.replace("/dashboard/child");
        }
      }, 100);
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
    Cookies.remove("fb_auth_token");
    router.push("/auth/signin");
  };

  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, {
      displayName,
      photoURL: photoURL || auth.currentUser.photoURL,
    });
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    logout,
    updateUserProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
