"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    challenges: true,
    friends: true,
  });

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
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="sarah@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="sarahcreates" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input id="password" type="password" />
              </div>

              <Button className="bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black">
                Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">
                    Receive updates about your activity
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, email: checked })
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
                  checked={notifications.challenges}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, challenges: checked })
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
                  checked={notifications.friends}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, friends: checked })
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
                  <Button variant="outline" className="justify-start">
                    Public
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Friends Only
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Activity Sharing</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    Everyone
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Friends
                  </Button>
                </div>
              </div>

              <Button className="bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black">
                Save Privacy Settings
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}