"use client";

import { useState, useEffect } from "react";
import { CategoryFilters } from "@/components/shared/category-filters";
import {
  Palette,
  Code,
  BookOpen,
  Mic2,
  Gamepad2,
  Brain,
  Dumbbell,
  Camera,
  Users,
} from "lucide-react";
import * as FirestoreService from "@/lib/services/firestore";
import type { Course } from "@/lib/types";
import { CourseCard } from "@/components/library/course-card";

const COURSE_TOPICS = [
  { id: "all", label: "All Courses" },
  { id: "Art & Craft", label: "Art & Craft", icon: Palette },
  { id: "Coding", label: "Coding", icon: Code },
  { id: "Education", label: "Education", icon: BookOpen },
  { id: "Music", label: "Music", icon: Mic2 },
  { id: "Games", label: "Games", icon: Gamepad2 },
  { id: "Life Skills", label: "Life Skills", icon: Brain },
  { id: "Health & Fitness", label: "Health & Fitness", icon: Dumbbell },
  { id: "Media & Design", label: "Media & Design", icon: Camera },
  { id: "Community", label: "Community", icon: Users },
];

function EmptyState() {
  return (
    <div className="text-center py-12 bg-muted/30 rounded-lg">
      <div className="max-w-md mx-auto">
        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No courses found
        </h3>
        <p className="text-muted-foreground mb-4">
          {`We couldn't find any courses matching your criteria. Try adjusting your filters or check back later.`}
        </p>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await FirestoreService.getAllCourses();
        console.log("Fetched courses:", coursesData); // Debug log
        setCourses(coursesData);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses =
    selectedCategory === "all"
      ? courses
      : courses.filter((course) => {
          console.log("Course topics:", course.topics); // Debug log
          return course.topics?.includes(selectedCategory);
        });

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Course Library</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of interactive courses designed to help you
            learn and grow. Filter by category to find the perfect course for
            you.
          </p>
        </div>

        <CategoryFilters
          categories={COURSE_TOPICS}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState />
          </div>
        )}
      </div>
    </div>
  );
}
