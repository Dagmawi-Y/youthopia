"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import * as FirestoreService from "@/lib/services/firestore";
import { debounce } from "lodash";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

export default function CreateChildAccountPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const router = useRouter();
  const { user } = useAuth();

  const checkUsername = debounce(async (username: string) => {
    if (username.length < 3) {
      setIsUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const isAvailable = await FirestoreService.isUsernameAvailable(username);
      setIsUsernameAvailable(isAvailable);
    } catch (error) {
      console.error("Error checking username:", error);
    } finally {
      setIsCheckingUsername(false);
    }
  }, 500);

  useEffect(() => {
    if (username) {
      checkUsername(username);
    } else {
      setIsUsernameAvailable(null);
    }
    return () => checkUsername.cancel();
  }, [username]);

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isUsernameAvailable) {
      setError("Username is already taken");
      return;
    }

    if (username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const childAccount = await FirestoreService.createChildAccount(
        username,
        password,
        user.uid
      );

      await FirestoreService.updateParentChildAccounts(
        user.uid,
        childAccount.uid
      );

      router.push(`/dashboard/parent/child/${childAccount.uid}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create child account"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create Child Account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Username
              </label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={cn(
                    "block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-white dark:bg-gray-950",
                    {
                      "ring-green-500 dark:ring-green-500":
                        isUsernameAvailable === true,
                      "ring-red-500 dark:ring-red-500":
                        isUsernameAvailable === false,
                    }
                  )}
                  placeholder="Child's username"
                  minLength={3}
                />
                {username.length >= 3 && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {isCheckingUsername ? (
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    ) : isUsernameAvailable === true ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : isUsernameAvailable === false ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : null}
                  </div>
                )}
              </div>
              {username.length > 0 && username.length < 3 && (
                <p className="mt-1 text-sm text-red-500">
                  Username must be at least 3 characters
                </p>
              )}
              {isUsernameAvailable === false && (
                <p className="mt-1 text-sm text-red-500">
                  This username is already taken
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-white dark:bg-gray-950"
                placeholder="Password"
                minLength={6}
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-white dark:bg-gray-950"
                placeholder="Confirm password"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={
                loading || isCheckingUsername || isUsernameAvailable === false
              }
              className="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Child Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
