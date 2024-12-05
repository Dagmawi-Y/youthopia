"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src="https://images.unsplash.com/photo-1491308056676-205b7c9a7dc1?w=800&auto=format&fit=crop&q=60" />
                <AvatarFallback>YT</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">Sarah Johnson</h2>
              <p className="text-gray-500">Joined January 2024</p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex space-x-2">
                  <Input id="username" value="sarahcreates" />
                  <Button size="icon" variant="ghost">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <div className="flex space-x-2">
                  <Input
                    id="bio"
                    value="Love art, science, and making new friends! 🎨 🔬"
                  />
                  <Button size="icon" variant="ghost">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 bg-[#7BD3EA] rounded-full" />
                <p>Completed &ldquo;Digital Art Basics&rdquo; course</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 bg-[#A1EEBD] rounded-full" />
                <p>Joined &ldquo;Weekly Art Challenge&rdquo;</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-2 w-2 bg-[#F6F7C4] rounded-full" />
                <p>Made 3 new friends</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Friends</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <Avatar>
                    <AvatarImage src={`https://i.pravatar.cc/150?img=${i}`} />
                    <AvatarFallback>FR</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">Friend {i}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}