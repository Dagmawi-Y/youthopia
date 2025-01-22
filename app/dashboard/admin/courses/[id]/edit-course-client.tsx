"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as FirestoreService from "@/lib/services/firestore";
import { Course } from "@/lib/types";
import { AdminRoute } from "../../../../../components/auth/admin-route";

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );
}

export function EditCourseClient({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseData, setCourseData] = useState<Course | null>(null);

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

  if (loading) return <LoadingState />;
  if (error) return <div className="text-red-600 text-center">{error}</div>;
  if (!courseData) return <div className="text-center">Course not found</div>;

  return (
    <AdminRoute>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">
          Edit Course: {courseData.title}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
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
                <label className="block text-sm font-medium">Description</label>
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
                <label className="block text-sm font-medium">Image URL</label>
                <input
                  type="url"
                  value={courseData.imageURL || ""}
                  onChange={(e) =>
                    setCourseData({ ...courseData, imageURL: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Difficulty</label>
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
                <label className="block text-sm font-medium">
                  Duration (minutes)
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
                  min="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Points</label>
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
            </div>
          </div>

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
    </AdminRoute>
  );
}
