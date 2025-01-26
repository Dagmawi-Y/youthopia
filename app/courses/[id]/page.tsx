import { Metadata } from "next";
import CoursePageClient from "./course-page-client";

export const metadata: Metadata = {
  title: "Course Details | Youthopia",
  description: "Learn and grow with our interactive courses",
};

export default function CoursePage({ params }: { params: { id: string } }) {
  return <CoursePageClient courseId={params.id} />;
}
