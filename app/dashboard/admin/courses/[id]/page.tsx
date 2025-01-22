import { EditCourseClient } from "./edit-course-client.js";

interface EditCoursePageProps {
  params: { id: string };
}

export default function EditCoursePage({ params }: EditCoursePageProps) {
  return <EditCourseClient courseId={params.id} />;
}
