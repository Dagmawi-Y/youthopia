import { Activity, Library, Trophy, User, LayoutDashboard } from "lucide-react";

export const NAVIGATION_ITEMS = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Activity", href: "/activity", icon: Activity },
  { title: "Library", href: "/library", icon: Library },
  { title: "Challenges", href: "/challenges", icon: Trophy },
  { title: "Profile", href: "/profile", icon: User },
];

export const MOCK_POSTS = [
  {
    id: 1,
    username: "artexplorer",
    caption: "Just finished my first digital art piece! 🎨",
    imageUrl:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60",
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    username: "sciencewhiz",
    caption: "Check out my science project! 🔬",
    imageUrl:
      "https://images.unsplash.com/photo-1530982011887-3cc11cc85693?w=800&auto=format&fit=crop&q=60",
    likes: 45,
    comments: 12,
  },
];

export const MOCK_COURSES = [
  {
    id: 1,
    title: "Digital Art Basics",
    description: "Learn the fundamentals of digital art and creativity",
    imageUrl:
      "https://images.unsplash.com/photo-1560762484-813fc97650a0?w=800&auto=format&fit=crop&q=60",
    level: "Beginner",
  },
  {
    id: 2,
    title: "Fun with Science",
    description: "Explore amazing science experiments and discoveries",
    imageUrl:
      "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800&auto=format&fit=crop&q=60",
    level: "Intermediate",
  },
];

export const MOCK_CHALLENGES = [
  {
    id: 1,
    title: "Weekly Art Challenge",
    description: "Create an artwork using only primary colors",
    imageUrl:
      "https://images.unsplash.com/photo-1499892477393-f675706cbe6e?w=800&auto=format&fit=crop&q=60",
    participants: 156,
    daysLeft: 3,
  },
  {
    id: 2,
    title: "Science Explorer",
    description: "Document a natural phenomenon in your backyard",
    imageUrl:
      "https://images.unsplash.com/photo-1530210124550-912dc1381cb8?w=800&auto=format&fit=crop&q=60",
    participants: 89,
    daysLeft: 5,
  },
];
