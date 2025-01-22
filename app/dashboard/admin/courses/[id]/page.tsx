"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as FirestoreService from "@/lib/services/firestore";
import { Course, CourseModule } from "@/lib/types";
import { AdminRoute } from "../../../../../components/auth/admin-route";

export default function EditCourse({ params }: { params: { id: string } }) {
  return (
    <AdminRoute>
      <EditCourseContent courseId={params.id} />
    </AdminRoute>
  );
}

function EditCourseContent({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [currentModule, setCurrentModule] = useState<Partial<CourseModule>>({
    title: "",
    content: "",
    videoURL: "",
    order: 0,
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course = await FirestoreService.getCourse(courseId);
        if (!course) {
          setError("Course not found");
          return;
        }
        setCourseData(course);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseData) return;

    setSaving(true);
    setError(null);

    try {
      await FirestoreService.updateCourse(courseId, courseData);
      router.push("/dashboard/admin/courses");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update course");
      setSaving(false);
    }
  };

  const addModule = () => {
    if (!courseData || !currentModule.title || !currentModule.content) return;

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
  };

  const removeModule = (moduleId: string) => {
    if (!courseData) return;

    setCourseData({
      ...courseData,
      modules: courseData.modules.filter((m) => m.id !== moduleId),
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Course not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Edit Course: {courseData.title}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  value={courseData.title}
                  onChange={(e) =>
                    setCourseData({ ...courseData, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Image URL
                </label>
                <input
                  type="url"
                  value={courseData.imageURL}
                  onChange={(e) =>
                    setCourseData({ ...courseData, imageURL: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>
            </div>

            {/* Course Details */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Difficulty
                </label>
                <select
                  value={courseData.difficulty}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      difficulty: e.target.value as Course["difficulty"],
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Duration (hours)
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Points
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Instructor
                </label>
                <input
                  type="text"
                  value={courseData.instructor}
                  onChange={(e) =>
                    setCourseData({ ...courseData, instructor: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Topics (comma-separated)
                </label>
                <input
                  type="text"
                  value={courseData.topics.join(", ")}
                  onChange={(e) =>
                    setCourseData({
                      ...courseData,
                      topics: e.target.value
                        .split(",")
                        .map((topic) => topic.trim())
                        .filter(Boolean),
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modules Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Course Modules</h2>

          {/* Module List */}
          <div className="mb-6 space-y-4">
            {courseData.modules.map((module) => (
              <div
                key={module.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{module.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {module.content.substring(0, 100)}...
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeModule(module.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Add Module Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Module Title
              </label>
              <input
                type="text"
                value={currentModule.title}
                onChange={(e) =>
                  setCurrentModule({ ...currentModule, title: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Video URL (optional)
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
            </div>

            <button
              type="button"
              onClick={addModule}
              className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add Module
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm mt-2">Error: {error}</div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard/admin/courses")}
            className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
