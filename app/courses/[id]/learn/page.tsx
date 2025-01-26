import { Metadata } from "next";
import LearnPageClient from "./learn-page-client";

export const metadata: Metadata = {
  title: "Learn Course | Youthopia",
  description: "Interactive learning experience",
};

export default function LearnPage({ params }: { params: { id: string } }) {
  return <LearnPageClient courseId={params.id} />;
}
