import { Metadata } from "next";
import LearnPageClient from "./learn-page-client";

export const metadata: Metadata = {
  title: "Learn Course | Youthopia",
  description: "Interactive learning experience",
};

export default async function LearnPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <LearnPageClient courseId={id} />;
}
