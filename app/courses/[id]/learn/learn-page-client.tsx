"use client";

import { useEffect, useState } from "react";
import { Course, CourseModule, Quiz, UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/context/auth-context";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  increment,
} from "firebase/firestore";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  PlayCircle,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import { Image as TiptapImage } from "@tiptap/extension-image";

export default function LearnPageClient({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [moduleProgress, setModuleProgress] = useState<boolean[]>([]);
  const { user } = useAuth();

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

          // Fetch user's progress
          if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data() as UserProfile;
            const progress =
              userData.courseProgress?.[courseId]?.completedModules ||
              new Array(courseData.modules.length).fill(false);
            setModuleProgress(progress);
          } else {
            setModuleProgress(new Array(courseData.modules.length).fill(false));
          }
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast.error("Failed to load course");
      }
    };

    fetchCourse();
  }, [courseId, user]);

  useEffect(() => {
    if (editor && course?.modules[currentModuleIndex]) {
      editor.commands.setContent(course.modules[currentModuleIndex].content);
    }
  }, [currentModuleIndex, course, editor]);

  const currentModule = course?.modules[currentModuleIndex];

  const handleModuleComplete = async () => {
    if (!course || !user) return;

    try {
      const newProgress = [...moduleProgress];
      newProgress[currentModuleIndex] = true;
      setModuleProgress(newProgress);

      // Update user's progress in Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        [`courseProgress.${courseId}.completedModules`]: newProgress,
      });

      // If all modules are complete, mark course as completed
      if (newProgress.every(Boolean)) {
        await updateDoc(userRef, {
          completedCourses: arrayUnion(courseId),
          points: increment(course.points),
        });
        toast.success(
          `Congratulations! You've completed the course and earned ${course.points} points!`
        );
      }

      // Move to next module if available
      if (currentModuleIndex < course.modules.length - 1) {
        setCurrentModuleIndex(currentModuleIndex + 1);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    }
  };

  const handleQuizSubmit = () => {
    if (!currentModule?.quiz) return;

    const correctAnswers = currentModule.quiz.questions.map(
      (q) => q.correctAnswer
    );
    const score = quizAnswers.reduce((acc, answer, index) => {
      return acc + (answer === correctAnswers[index] ? 1 : 0);
    }, 0);

    const percentage = (score / correctAnswers.length) * 100;
    setShowQuizResults(true);

    if (percentage >= currentModule.quiz.passingScore) {
      handleModuleComplete();
      toast.success("Quiz passed! Moving to next module.");
    } else {
      toast.error("Quiz failed. Please try again.");
    }
  };

  if (!course || !currentModule) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  const progressPercentage =
    (moduleProgress.filter(Boolean).length / moduleProgress.length) * 100;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-4 border-b">
          <h2 className="font-semibold">{course.title}</h2>
          <Progress value={progressPercentage} className="mt-2" />
          <p className="text-sm text-muted-foreground mt-1">
            {Math.round(progressPercentage)}% Complete
          </p>
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          {course.modules.map((module, index) => (
            <button
              key={module.id}
              onClick={() => setCurrentModuleIndex(index)}
              className={cn(
                "w-full p-4 text-left flex items-center gap-3 hover:bg-muted/50 transition-colors",
                currentModuleIndex === index && "bg-muted"
              )}
            >
              {moduleProgress[index] ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <PlayCircle className="w-5 h-5" />
              )}
              <div>
                <p className="font-medium">{module.title}</p>
                <p className="text-sm text-muted-foreground">
                  {module.quiz ? "Quiz" : "Lesson"}
                </p>
              </div>
            </button>
          ))}
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-6">{currentModule.title}</h1>

          {currentModule.videoURL && (
            <div className="aspect-video mb-8">
              <iframe
                src={currentModule.videoURL}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
            <EditorContent editor={editor} />
          </div>

          {currentModule.quiz && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Module Quiz</h3>
              {currentModule.quiz.questions.map((question, qIndex) => (
                <div key={question.id} className="mb-6">
                  <p className="font-medium mb-3">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className={cn(
                          "p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors",
                          quizAnswers[qIndex] === oIndex &&
                            "border-primary bg-primary/10",
                          showQuizResults &&
                            oIndex === question.correctAnswer &&
                            "border-green-500 bg-green-50",
                          showQuizResults &&
                            quizAnswers[qIndex] === oIndex &&
                            oIndex !== question.correctAnswer &&
                            "border-red-500 bg-red-50"
                        )}
                        onClick={() => {
                          if (!showQuizResults) {
                            const newAnswers = [...quizAnswers];
                            newAnswers[qIndex] = oIndex;
                            setQuizAnswers(newAnswers);
                          }
                        }}
                      >
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {!showQuizResults && (
                <Button onClick={handleQuizSubmit} className="w-full">
                  Submit Quiz
                </Button>
              )}
            </Card>
          )}

          {!currentModule.quiz && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentModuleIndex(Math.max(0, currentModuleIndex - 1))
                }
                disabled={currentModuleIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <Button
                onClick={handleModuleComplete}
                disabled={moduleProgress[currentModuleIndex]}
              >
                {moduleProgress[currentModuleIndex] ? (
                  "Completed"
                ) : (
                  <>
                    Complete & Continue
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
