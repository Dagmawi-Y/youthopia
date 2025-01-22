"use client";

import { useState, useEffect } from "react";
import { CategoryFilters } from "@/components/shared/category-filters";
import { Palette, Code, BookOpen, Mic2, Gamepad2, Brain } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import * as FirestoreService from "@/lib/services/firestore";
import type { Course } from "@/lib/types";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "art", label: "Art & Craft", icon: Palette },
  { id: "stem", label: "STEM", icon: Code },
  { id: "life-skills", label: "Life Skills", icon: Brain },
  { id: "performing-arts", label: "Performing Arts", icon: Mic2 },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
];

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={course.imageURL || "/placeholder-course.jpg"}
          alt={course.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#7BD3EA]/10 text-[#7BD3EA]">
            {course.level}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 group-hover:text-[#7BD3EA] transition-colors">
          {course.title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{course.description}</p>
        <Button className="mt-4 w-full bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black rounded-full">
          View Course
        </Button>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <BookOpen className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">No Courses Yet</h3>
      <p className="mt-1 text-sm text-gray-500">
        Check back soon for new courses!
      </p>
    </div>
  );
}

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await FirestoreService.getAllCourses();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Filters */}
      <div className="mb-8">
        <CategoryFilters
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Course Grid */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
