"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as FirestoreService from "@/lib/services/firestore";
import { Course, CourseModule } from "@/lib/types";
import { AdminRoute } from "../../../../../components/auth/admin-route";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Link from "@tiptap/extension-link";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";

const isValidYoutubeUrl = (url: string) => {
  const youtubeRegex =
    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  return youtubeRegex.test(url);
};

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
                    <div className="mt-2 prose prose-sm dark:prose-invert max-w-none">
                      <div
                        dangerouslySetInnerHTML={{ __html: module.content }}
                      />
                    </div>
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
                {module.videoURL && isValidYoutubeUrl(module.videoURL) && (
                  <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe
                      src={(module.videoURL as string).replace(
                        "watch?v=",
                        "embed/"
                      )}
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
                <RichTextEditor
                  content={currentModule.content}
                  onChange={(html) =>
                    setCurrentModule({
                      ...currentModule,
                      content: html,
                    })
                  }
                />
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Use the toolbar above to format your content. You can also use
                  Markdown syntax.
                </div>
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
                {currentModule.videoURL &&
                  isValidYoutubeUrl(currentModule.videoURL) && (
                    <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-black">
                      <iframe
                        src={(currentModule.videoURL as string).replace(
                          "watch?v=",
                          "embed/"
                        )}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                {currentModule.videoURL &&
                  !isValidYoutubeUrl(currentModule.videoURL) && (
                    <div className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                      Please enter a valid YouTube URL (e.g.,
                      https://youtube.com/watch?v=...)
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

function LinkDialog({
  isOpen,
  onClose,
  onSave,
  hasSelectedText,
  initialUrl = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string, text?: string) => void;
  hasSelectedText: boolean;
  initialUrl?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {hasSelectedText ? "Add Link" : "Add Link with Text"}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA]"
              placeholder="https://"
              autoFocus
            />
          </div>
          {!hasSelectedText && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-[#7BD3EA] focus:ring-2 focus:ring-[#7BD3EA]"
                placeholder="Link text"
              />
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (url) {
                onSave(url, !hasSelectedText ? text : undefined);
                setUrl("");
                setText("");
                onClose();
              }
            }}
            disabled={!url || (!hasSelectedText && !text)}
            className="px-4 py-2 rounded-lg bg-[#7BD3EA] hover:bg-[#7BD3EA]/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function RichTextEditor({
  content,
  onChange,
}: {
  content: string | undefined;
  onChange: (html: string) => void;
}) {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
      Link.configure({
        openOnClick: false,
      }),
      CodeBlock,
      Image,
    ],
    content: content || "",
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert focus:outline-none max-w-none",
      },
    },
    onUpdate: ({ editor }: { editor: Editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = () => {
    // Create a hidden file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          editor?.chain().focus().setImage({ src: result }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const setLink = () => {
    const previousUrl = editor?.getAttributes("link").href;
    const selection = editor?.state.selection;
    const hasText = !selection?.empty;

    setShowLinkDialog(true);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <div className="bg-white dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 p-2 flex flex-wrap gap-1">
        {/* History Controls */}
        <div className="flex gap-1 mr-2 border-r border-gray-200 dark:border-gray-600 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
            title="Undo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h10a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H3m0-4l4-4m-4 4l4 4"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
            title="Redo"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 10h-10a4 4 0 0 0-4 4v0a4 4 0 0 0 4 4h10m0-4l-4-4m4 4l-4 4"
              />
            </svg>
          </button>
        </div>

        {/* Text Formatting */}
        <div className="flex gap-1 mr-2 border-r border-gray-200 dark:border-gray-600 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${
              editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-600" : ""
            }`}
            title="Bold"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 12h8a4 4 0 0 0 0-8H6v8zm0 0h9a4 4 0 0 1 0 8H6v-8z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${
              editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-600" : ""
            }`}
            title="Italic"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <line x1="19" y1="4" x2="10" y2="4" strokeWidth={2} />
              <line x1="14" y1="20" x2="5" y2="20" strokeWidth={2} />
              <line x1="15" y1="4" x2="9" y2="20" strokeWidth={2} />
            </svg>
          </button>
        </div>

        {/* Headings and Lists */}
        <div className="flex gap-1 mr-2 border-r border-gray-200 dark:border-gray-600 pr-2">
          <button
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${
              editor.isActive("heading", { level: 2 })
                ? "bg-gray-200 dark:bg-gray-600"
                : ""
            }`}
            title="Heading"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${
              editor.isActive("bulletList")
                ? "bg-gray-200 dark:bg-gray-600"
                : ""
            }`}
            title="Bullet List"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${
              editor.isActive("orderedList")
                ? "bg-gray-200 dark:bg-gray-600"
                : ""
            }`}
            title="Numbered List"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16M3 10V4m0 12v-2m0 8v-2"
              />
            </svg>
          </button>
        </div>

        {/* Block Elements */}
        <div className="flex gap-1 mr-2 border-r border-gray-200 dark:border-gray-600 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${
              editor.isActive("blockquote")
                ? "bg-gray-200 dark:bg-gray-600"
                : ""
            }`}
            title="Block Quote"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            title="Horizontal Rule"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 12h14"
              />
            </svg>
          </button>
        </div>

        {/* Code */}
        <div className="flex gap-1 mr-2 border-r border-gray-200 dark:border-gray-600 pr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${
              editor.isActive("codeBlock") ? "bg-gray-200 dark:bg-gray-600" : ""
            }`}
            title="Code Block"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        {/* Links and Media */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600 ${
              editor.isActive("link") ? "bg-gray-200 dark:bg-gray-600" : ""
            }`}
            title="Add Link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
            title="Add Image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                ry="2"
                strokeWidth={2}
              />
              <circle cx="8.5" cy="8.5" r="1.5" strokeWidth={2} />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 15l-5-5L5 21"
              />
            </svg>
          </button>
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[200px] bg-white dark:bg-gray-700 focus:outline-none"
      />
      <LinkDialog
        isOpen={showLinkDialog}
        onClose={() => setShowLinkDialog(false)}
        hasSelectedText={!editor?.state.selection.empty}
        initialUrl={editor?.getAttributes("link").href}
        onSave={(url, text) => {
          if (!editor?.state.selection.empty) {
            editor?.chain().focus().setLink({ href: url }).run();
          } else if (text) {
            editor
              ?.chain()
              .focus()
              .insertContent({
                type: "text",
                text: text,
                marks: [
                  {
                    type: "link",
                    attrs: { href: url },
                  },
                ],
              })
              .run();
          }
        }}
      />
    </div>
  );
}
