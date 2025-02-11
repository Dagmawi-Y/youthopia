import { Post, Course, Challenge, UserProfile } from "../types";

export const mockUsers: Partial<UserProfile>[] = [
  {
    displayName: "Alice Johnson",
    email: "alice@example.com",
    bio: "Tech enthusiast and lifelong learner",
    points: 1200,
    completedCourses: ["course1", "course2"],
    completedChallenges: ["challenge1"],
    badges: ["early-adopter", "course-master"],
  },
  {
    displayName: "Bob Smith",
    email: "bob@example.com",
    bio: "Software developer and mentor",
    points: 800,
    completedCourses: ["course1"],
    completedChallenges: ["challenge2"],
    badges: ["challenge-champion"],
  },
];

export const mockPosts: Post[] = [
  {
    id: "post1",
    title: "Just completed the Python basics course!",
    content:
      "Really enjoyed learning about data structures and algorithms. Looking forward to the advanced course!",
    authorId: "user1",
    authorName: "Alice Johnson",
    likes: [],
    comments: [],
    tags: ["python", "learning", "achievement"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "post2",
    title: "Tips for new developers",
    content: "Here are some tips that helped me when I started programming...",
    authorId: "user2",
    authorName: "Bob Smith",
    likes: [],
    comments: [],
    tags: ["tips", "beginners", "programming"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockCourses: Partial<Course>[] = [
  {
    title: "Python Programming Basics",
    description: "Learn the fundamentals of Python programming language",
    instructor: "Dr. Sarah Wilson",
    duration: 4,
    level: "Beginner",
    topics: ["Variables", "Control Flow", "Functions", "Data Structures"],
    enrolledCount: 150,
    rating: 4.8,
    reviews: [
      {
        rating: 5,
        content: "Excellent course for beginners!",
        userId: "user1",
        userName: "Alice Johnson",
        createdAt: new Date(),
      },
    ],
  },
  {
    title: "Web Development Fundamentals",
    description: "Master HTML, CSS, and JavaScript basics",
    instructor: "Mike Brown",
    duration: 6,
    level: "Intermediate",
    topics: ["HTML5", "CSS3", "JavaScript ES6", "Responsive Design"],
    enrolledCount: 200,
    rating: 4.6,
    reviews: [],
  },
];

export const mockChallenges: Partial<Challenge>[] = [
  {
    title: "Build a Todo App",
    description:
      "Create a full-stack todo application using React and Firebase",
    difficulty: "intermediate",
    points: 100,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    participants: ["user1", "user2"],
    submissions: [
      {
        userId: "user1",
        userName: "Alice Johnson",
        repositoryUrl: "https://github.com/alice/todo-app",
        submittedAt: new Date(),
      },
    ],
  },
  {
    title: "Algorithm Challenge: Array Manipulation",
    description: "Solve 5 array manipulation problems in Python",
    difficulty: "advanced",
    points: 150,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    participants: ["user2"],
    submissions: [],
  },
];
