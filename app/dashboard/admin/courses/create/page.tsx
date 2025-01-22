"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as FirestoreService from "@/lib/services/firestore";
import { Course, CourseModule } from "@/lib/types";
import { AdminRoute } from "../../../../../components/auth/admin-route";

export default function CreateCourse() {
  return (
    <AdminRoute>
      <CreateCourseContent />
    </AdminRoute>
  );
}

function CreateCourseContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<Partial<Course>>({
    title: "",
    description: "",
    imageURL: "",
    modules: [],
    difficulty: "beginner",
    duration: 0,
    points: 0,
    instructor: "",
    level: "Beginner",
    topics: [],
    enrolledCount: 0,
    rating: 0,
    reviews: [],
  });

  const [currentModule, setCurrentModule] = useState<Partial<CourseModule>>({
    title: "",
    content: "",
    videoURL: "",
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await FirestoreService.createCourse(courseData as Course);
      router.push("/dashboard/admin/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  const addModule = () => {
    if (currentModule.title && currentModule.content) {
      setCourseData({
        ...courseData,
        modules: [
          ...(courseData.modules || []),
          { ...currentModule, id: Date.now().toString() } as CourseModule,
        ],
      });
      setCurrentModule({
        title: "",
        content: "",
        videoURL: "",
        order: (courseData.modules?.length || 0) + 1,
      });
    }
  };

  const removeModule = (moduleId: string) => {
    setCourseData({
      ...courseData,
      modules: courseData.modules?.filter((m) => m.id !== moduleId) || [],
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Course
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Fill in the details below to create a new course.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Basic Information
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Title
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) =>
                    setCourseData({ ...courseData, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                  placeholder="Enter course title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Description
                </label>
                <textarea
                  value={courseData.description}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                  placeholder="Describe what students will learn"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Image URL
                </label>
                <input
                  type="url"
                  value={courseData.imageURL}
                  onChange={(e) =>
                    setCourseData({ ...courseData, imageURL: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                  placeholder="Enter image URL"
                  required
                />
              </div>
            </div>

            {/* Course Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Course Details
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={courseData.difficulty}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      difficulty: e.target.value as Course["difficulty"],
                    })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Duration (hours)
                </label>
                <input
                  type="number"
                  value={courseData.duration}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  min="0"
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                  placeholder="Enter duration in hours"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Points Reward
                </label>
                <input
                  type="number"
                  value={courseData.points}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      points: parseInt(e.target.value),
                    })
                  }
                  min="0"
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                  placeholder="Enter points value"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Instructor Name
                </label>
                <input
                  type="text"
                  value={courseData.instructor}
                  onChange={(e) =>
                    setCourseData({ ...courseData, instructor: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                  placeholder="Enter instructor name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course Topics
                </label>
                <input
                  type="text"
                  value={courseData.topics?.join(", ")}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      topics: e.target.value
                        .split(",")
                        .map((topic) => topic.trim())
                        .filter(Boolean),
                    })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                  placeholder="Enter topics (comma-separated)"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Course Modules
          </h2>

          {/* Module List */}
          <div className="mb-8 space-y-4">
            {courseData.modules?.map((module, index) => (
              <div
                key={module.id}
                className="flex flex-col p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#7BD3EA]/20 text-[#7BD3EA] font-semibold text-sm">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {module.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {module.content}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeModule(module.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
                {module.videoURL && (
                  <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={module.videoURL.replace("watch?v=", "embed/")}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Module Form */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Add New Module
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Module Title
                </label>
                <input
                  type="text"
                  value={currentModule.title}
                  onChange={(e) =>
                    setCurrentModule({
                      ...currentModule,
                      title: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                  placeholder="Enter module title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Module Content
                </label>
                <textarea
                  value={currentModule.content}
                  onChange={(e) =>
                    setCurrentModule({
                      ...currentModule,
                      content: e.target.value,
                    })
                  }
                  rows={4}
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                  placeholder="Enter module content and instructions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Video URL (YouTube)
                </label>
                <input
                  type="url"
                  value={currentModule.videoURL}
                  onChange={(e) =>
                    setCurrentModule({
                      ...currentModule,
                      videoURL: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA] transition-colors"
                  placeholder="Enter YouTube video URL"
                />
                {currentModule.videoURL && (
                  <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={currentModule.videoURL.replace("watch?v=", "embed/")}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={addModule}
                disabled={!currentModule.title || !currentModule.content}
                className="w-full px-6 py-3 rounded-lg bg-[#7BD3EA] hover:bg-[#7BD3EA]/90 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Module
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm mt-4">
            Error: {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/admin/courses")}
            className="px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-[#7BD3EA] hover:bg-[#7BD3EA]/90 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}
