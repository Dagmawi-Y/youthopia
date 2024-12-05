"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAVIGATION_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UserCircle, Sparkles, Menu, Settings, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { auth } from "@/lib/auth";
import type { User as UserType } from "@/lib/types";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const currentUser = auth.getCurrentUser();
    setUser(currentUser);
  }, [pathname]);

  const handleSignOut = () => {
    auth.logout();
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 w-full backdrop-blur-md bg-white/70 border-b border-[#A1EEBD]/20 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link href={user ? "/activity" : "/"} className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-[#7BD3EA]" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#7BD3EA] via-[#A1EEBD] to-[#F6F7C4] bg-clip-text text-transparent">
                Youthopia
              </span>
            </Link>
          </div>

          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                    pathname === item.href
                      ? "bg-[#7BD3EA]/10 text-[#7BD3EA]"
                      : "text-gray-600 hover:bg-[#A1EEBD]/10 hover:text-[#A1EEBD]"
                  )}
                >
                  {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                  {item.title}
                </Link>
              ))}
            </div>
          )}

          {user && (
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Nicknames or Hashtags"
                  className="w-full px-4 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-[#7BD3EA] text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#7BD3EA]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="default"
                  className="bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black rounded-full"
                >
                  Verify Profile
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden md:flex md:space-x-2">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-[#7BD3EA]"
                  onClick={() => router.push("/auth/signin")}
                >
                  Sign in
                </Button>
                <Button
                  className="bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black rounded-full"
                  onClick={() => router.push("/auth/signup")}
                >
                  Sign up
                </Button>
              </div>
            )}

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {NAVIGATION_ITEMS.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center">
                        {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signin">Sign in</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/signup">Sign up</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}