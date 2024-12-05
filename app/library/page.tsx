"use client";

import { useState } from "react";
import { MOCK_COURSES } from "@/lib/constants";
import { CategoryFilters } from "@/components/shared/category-filters";
import { Palette, Code, BookOpen, Mic2, Gamepad2, Brain } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "art", label: "Art & Craft", icon: Palette },
  { id: "stem", label: "STEM", icon: Code },
  { id: "life-skills", label: "Life Skills", icon: Brain },
  { id: "performing-arts", label: "Performing Arts", icon: Mic2 },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
];

function CourseCard({ course }: { course: typeof MOCK_COURSES[0] }) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={course.imageUrl}
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
        <Button
          className="mt-4 w-full bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black rounded-full"
        >
          View Course
        </Button>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [courses] = useState(MOCK_COURSES);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}