"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/auth-context";
import * as FirestoreService from "@/lib/services/firestore";
import { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParentRoute } from "@/components/auth/parent-route";
import { toast } from "@/hooks/use-toast";

export default function EditChildPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <ParentRoute>
      <EditChildContent params={resolvedParams} />
    </ParentRoute>
  );
}

function EditChildContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [childProfile, setChildProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
  });

  useEffect(() => {
    const fetchChildProfile = async () => {
      if (!user) {
        router.push("/auth/signin");
        return;
      }

      try {
        const profile = await FirestoreService.getUserProfile(params.id);
        if (!profile || profile.parentId !== user.uid) {
          throw new Error("Child profile not found or access denied");
        }
        setChildProfile(profile);
        setFormData({
          displayName: profile.displayName,
          username: profile.username,
        });
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to fetch child profile",
          variant: "destructive",
        });
        router.push("/dashboard/parent");
      } finally {
        setLoading(false);
      }
    };

    fetchChildProfile();
  }, [user, params.id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !childProfile) return;

    setSaving(true);
    try {
      await FirestoreService.updateUserProfile(childProfile.uid, {
        ...childProfile,
        ...formData,
      });
      toast({
        title: "Success",
        description: "Child profile updated successfully",
      });
      router.push(`/dashboard/parent/child/${childProfile.uid}`);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!childProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">Child profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.back()}
            className="mb-6 text-primary hover:text-primary/80"
          >
            ← Back
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Edit {childProfile.displayName}'s Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
