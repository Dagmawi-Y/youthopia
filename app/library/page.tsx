import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CourseCard } from "@/components/library/course-card";
import { MOCK_COURSES } from "@/lib/constants";

export default function LibraryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Learning Library</h1>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex w-max space-x-4 p-4">
          {MOCK_COURSES.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}