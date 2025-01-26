import { Course } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const router = useRouter();

  const handleViewCourse = () => {
    router.push(`/courses/${course.id}`);
  };

  return (
    <Card className="w-[300px] flex flex-col">
      <img
        src={course.imageURL}
        alt={course.title}
        className="h-40 w-full object-cover rounded-t-lg"
      />
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-lg">{course.title}</h3>
          <Badge variant="secondary">{course.level}</Badge>
        </div>
        <p className="text-gray-600 text-sm">{course.description}</p>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          className="w-full bg-[#A1EEBD] hover:bg-[#7BD3EA] text-black"
          onClick={handleViewCourse}
        >
          View Course
        </Button>
      </CardFooter>
    </Card>
  );
}
