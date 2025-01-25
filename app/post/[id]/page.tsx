import { Suspense } from "react";
import PostPageClient from "./post-page-client";

export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={<div className="text-center py-8">Loading post...</div>}
    >
      <PostPageClient postId={params.id} />
    </Suspense>
  );
}
