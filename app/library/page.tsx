"use client";

import { useState, useEffect } from "react";
import { CategoryFilters } from "@/components/shared/category-filters";
import { Palette, Code, BookOpen, Mic2, Gamepad2, Brain } from "lucide-react";
import * as FirestoreService from "@/lib/services/firestore";
import type { Course } from "@/lib/types";
import { CourseCard } from "@/components/library/course-card";

export default function LibraryPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Courses" },
    { id: "art", label: "Art & Craft", icon: Palette },
    { id: "coding", label: "Coding", icon: Code },
    { id: "education", label: "Education", icon: BookOpen },
    { id: "music", label: "Music", icon: Mic2 },
    { id: "games", label: "Games", icon: Gamepad2 },
    { id: "skills", label: "Life Skills", icon: Brain },
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await FirestoreService.getAllCourses();
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
      : courses.filter((course) => course.topics.includes(selectedCategory));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Course Library</h1>

      <CategoryFilters
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
