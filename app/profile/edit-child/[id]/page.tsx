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
import Image from "next/image";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { updatePassword } from "firebase/auth";

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
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [childProfile, setChildProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");

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
          displayName: profile.displayName || "",
          username: profile.username || "",
          password: "",
          confirmPassword: "",
        });
        if (profile.photoURL) {
          setPhotoPreview(profile.photoURL);
        }
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoFile || !childProfile) return null;

    const fileRef = ref(
      storage,
      `profile-photos/${childProfile.uid}/${photoFile.name}`
    );
    await uploadBytes(fileRef, photoFile);
    return getDownloadURL(fileRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !childProfile) return;

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      let photoURL = childProfile.photoURL;

      if (photoFile) {
        setUploadingPhoto(true);
        const newPhotoURL = await uploadPhoto();
        if (newPhotoURL) {
          photoURL = newPhotoURL;
        }
        setUploadingPhoto(false);
      }

      // Update profile data
      await FirestoreService.updateUserProfile(childProfile.uid, {
        ...childProfile,
        displayName: formData.displayName,
        username: formData.username,
        photoURL,
      });

      // Update password if provided
      if (formData.password) {
        try {
          // Note: This requires the child's auth object, you might need to adjust based on your auth setup
          // This is just a placeholder - you'll need to implement the actual password update logic
          // await updatePassword(childAuth, formData.password);
          toast({
            title: "Note",
            description:
              "Password update functionality needs to be implemented based on your auth setup",
          });
        } catch (error) {
          toast({
            title: "Warning",
            description: "Profile updated but password change failed",
            variant: "destructive",
          });
        }
      }

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
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative w-32 h-32">
                  <Image
                    src={photoPreview || "/images/default-avatar.png"}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <Label
                    htmlFor="photo-upload"
                    className="cursor-pointer bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md"
                  >
                    Change Photo
                  </Label>
                </div>
              </div>

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

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Change Password
                </h3>
                <div>
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="mt-1"
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={saving || uploadingPhoto}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving || uploadingPhoto}>
                  {saving || uploadingPhoto ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
