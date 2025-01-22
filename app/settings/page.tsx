"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/context/auth-context";
import * as FirestoreService from "@/lib/services/firestore";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface NotificationSettings {
  emailNotifications: boolean;
  challengeUpdates: boolean;
  friendActivity: boolean;
}

interface PrivacySettings {
  profileVisibility: "public" | "friends";
  activitySharing: "everyone" | "friends";
}

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>({
      emailNotifications: true,
      challengeUpdates: true,
      friendActivity: true,
    });
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: "public",
    activitySharing: "everyone",
  });

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin");
      return;
    }

    const fetchSettings = async () => {
      try {
        const profile = await FirestoreService.getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          // Load saved notification settings if they exist
          if (profile.notificationSettings) {
            setNotificationSettings(profile.notificationSettings);
          }
          // Load saved privacy settings if they exist
          if (profile.privacySettings) {
            setPrivacySettings(profile.privacySettings);
          }
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user, router]);

  const handleAccountUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile) return;

    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const updates = {
        displayName: formData.get("displayName") as string,
        username: formData.get("username") as string,
      };

      await FirestoreService.updateUserProfile(user.uid, updates);
      toast({
        title: "Success",
        description: "Account settings updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationUpdate = async (
    settings: Partial<NotificationSettings>
  ) => {
    if (!user || !userProfile) return;

    try {
      const newSettings = { ...notificationSettings, ...settings };
      setNotificationSettings(newSettings);
      await FirestoreService.updateUserProfile(user.uid, {
        notificationSettings: newSettings,
      });
      toast({
        title: "Success",
        description: "Notification settings updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notification settings",
        variant: "destructive",
      });
    }
  };

  const handlePrivacyUpdate = async (settings: Partial<PrivacySettings>) => {
    if (!user || !userProfile) return;

    try {
      const newSettings = { ...privacySettings, ...settings };
      setPrivacySettings(newSettings);
      await FirestoreService.updateUserProfile(user.uid, {
        privacySettings: newSettings,
      });
      toast({
        title: "Success",
        description: "Privacy settings updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update privacy settings",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">Failed to load profile</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="account" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            <form onSubmit={handleAccountUpdate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userProfile.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  defaultValue={userProfile.displayName}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  defaultValue={userProfile.username}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">
              Notification Preferences
            </h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive updates about your activity
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    handleNotificationUpdate({ emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Challenge Updates</Label>
                  <p className="text-sm text-gray-500">
                    Get notified about new challenges
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.challengeUpdates}
                  onCheckedChange={(checked) =>
                    handleNotificationUpdate({ challengeUpdates: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Friend Activity</Label>
                  <p className="text-sm text-gray-500">
                    See what your friends are up to
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.friendActivity}
                  onCheckedChange={(checked) =>
                    handleNotificationUpdate({ friendActivity: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={
                      privacySettings.profileVisibility === "public"
                        ? "default"
                        : "outline"
                    }
                    className="justify-start"
                    onClick={() =>
                      handlePrivacyUpdate({ profileVisibility: "public" })
                    }
                  >
                    Public
                  </Button>
                  <Button
                    variant={
                      privacySettings.profileVisibility === "friends"
                        ? "default"
                        : "outline"
                    }
                    className="justify-start"
                    onClick={() =>
                      handlePrivacyUpdate({ profileVisibility: "friends" })
                    }
                  >
                    Friends Only
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Activity Sharing</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={
                      privacySettings.activitySharing === "everyone"
                        ? "default"
                        : "outline"
                    }
                    className="justify-start"
                    onClick={() =>
                      handlePrivacyUpdate({ activitySharing: "everyone" })
                    }
                  >
                    Everyone
                  </Button>
                  <Button
                    variant={
                      privacySettings.activitySharing === "friends"
                        ? "default"
                        : "outline"
                    }
                    className="justify-start"
                    onClick={() =>
                      handlePrivacyUpdate({ activitySharing: "friends" })
                    }
                  >
                    Friends
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
