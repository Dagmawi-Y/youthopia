import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { Course } from "../lib/types";
import { useAuth } from "../lib/context/auth-context";
import * as FirestoreService from "../lib/services/firestore";

export const useCourses = (limitCount = 10) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastCourse, setLastCourse] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  const fetchCourses = async (
    lastVisible?: any,
    filters?: { difficulty?: string }
  ) => {
    try {
      setLoading(true);
      const coursesRef = collection(db, "courses");
      let queryConstraints: any[] = [
        orderBy("createdAt", "desc"),
        limit(limitCount),
      ];

      if (lastVisible) {
        queryConstraints.push(startAfter(lastVisible));
      }

      if (filters?.difficulty) {
        queryConstraints.push(where("difficulty", "==", filters.difficulty));
      }

      const q = query(coursesRef, ...queryConstraints);
      const querySnapshot = await getDocs(q);
      const newCourses: Course[] = [];

      querySnapshot.forEach((doc) => {
        newCourses.push(doc.data() as Course);
      });

      if (!lastVisible) {
        setCourses(newCourses);
      } else {
        setCourses((prev) => [...prev, ...newCourses]);
      }

      setLastCourse(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === limitCount);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching courses"
      );
    } finally {
      setLoading(false);
    }
  };

  const loadMore = (filters?: { difficulty?: string }) => {
    if (lastCourse) {
      fetchCourses(lastCourse, filters);
    }
  };

  const getCourse = async (courseId: string) => {
    try {
      const course = await FirestoreService.getCourse(courseId);
      return course;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching the course"
      );
      return null;
    }
  };

  const completeCourse = async (courseId: string) => {
    if (!user) return;

    try {
      await FirestoreService.completeCourse(user.uid, courseId);

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === courseId ? { ...course } : course
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while completing the course"
      );
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    hasMore,
    loadMore,
    getCourse,
    completeCourse,
  };
};
