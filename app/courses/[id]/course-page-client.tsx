"use client";

import { useEffect, useState } from "react";
import { Course, UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/context/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { toast } from "sonner";
import { Star, Clock, Award, PlayCircle, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import { Image as TiptapImage } from "@tiptap/extension-image";

export default function CoursePageClient({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Link.configure({
        openOnClick: false,
      }),
      CodeBlock,
      TiptapImage,
    ],
    content: "",
    editable: false,
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseDoc = await getDoc(doc(db, "courses", courseId));
        if (courseDoc.exists()) {
          const courseData = {
            ...(courseDoc.data() as Course),
            id: courseDoc.id,
          };
          setCourse(courseData);

          if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data() as UserProfile;
            setIsEnrolled(userData.completedCourses.includes(courseId));

            // Calculate progress
            const moduleProgress =
              userData.courseProgress?.[courseId]?.completedModules;
            if (moduleProgress) {
              const completedCount = moduleProgress.filter(Boolean).length;
              const totalModules = courseData.modules.length;
              setProgress((completedCount / totalModules) * 100);
            }
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course details");
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, user]);

  useEffect(() => {
    if (editor && course?.modules[0]) {
      // Show the first module's content as preview
      editor.commands.setContent(course.modules[0].content);
    }
  }, [course, editor]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please sign in to enroll in courses");
      return;
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        completedCourses: arrayUnion(courseId),
        [`courseProgress.${courseId}.completedModules`]: new Array(
          course?.modules.length || 0
        ).fill(false),
      });

      await updateDoc(doc(db, "courses", courseId), {
        enrolledCount: (course?.enrolledCount || 0) + 1,
      });

      setIsEnrolled(true);
      toast.success("Successfully enrolled in the course!");
      router.push(`/courses/${courseId}/learn`);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Failed to enroll in the course");
    }
  };

  const handleStartLearning = () => {
    router.push(`/courses/${courseId}/learn`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Course not found
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Course Overview */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-muted-foreground mb-6">{course.description}</p>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{course.duration} hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              <span>{course.rating.toFixed(1)} Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              <span>{course.difficulty}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>{course.enrolledCount} students</span>
            </div>
          </div>

          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Course Content</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <Card key={module.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <PlayCircle className="w-5 h-5" />
                      <div>
                        <h3 className="font-semibold">{module.title}</h3>
                        <div className="prose prose-sm dark:prose-invert mt-2">
                          <EditorContent editor={editor} />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="reviews">
              <div className="space-y-4">
                {course.reviews.map((review, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{review.userName}</span>
                    </div>
                    <p className="text-muted-foreground">{review.content}</p>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Enrollment Card */}
        <div className="md:col-span-1">
          <Card className="p-6 sticky top-4">
            <img
              src={course.imageURL}
              alt={course.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{course.points} Points</p>
                  <p className="text-sm text-muted-foreground">
                    upon completion
                  </p>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={isEnrolled ? handleStartLearning : handleEnroll}
              >
                {isEnrolled ? "Start Learning" : "Enroll Now"}
              </Button>

              <div className="text-sm text-muted-foreground">
                <p>✓ {course.modules.length} modules</p>
                <p>✓ Certificate of completion</p>
                <p>✓ Lifetime access</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
