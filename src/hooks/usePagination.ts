// hooks/usePagination.ts
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchPosts } from "@/lib/reddit";
import { Post } from "@/types/reddit";

interface UsePaginationProps {
  initialPosts: Post[];
  initialAfter: string | null;
  initialBefore: string | null;
  subreddit: string;
}

export function usePagination({
  initialPosts,
  initialAfter,
  initialBefore,
  subreddit,
}: UsePaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [after, setAfter] = useState<string | null>(initialAfter);
  const [before, setBefore] = useState<string | null>(initialBefore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cursorStack = useRef<{ after: string | null; before: string | null }[]>([]);
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  useEffect(() => {
    if (initialAfter || initialBefore) {
      cursorStack.current = [{ after: initialAfter, before: initialBefore }];
    }
  }, [initialAfter, initialBefore]);

  const updateUrl = (after: string | null, before: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    after ? params.set("after", after) : params.delete("after");
    before ? params.set("before", before) : params.delete("before");
    params.set("limit", limit.toString());
    router.push(`?${params.toString()}`);
  };

  const handleNext = async () => {
    if (!after || loading) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetchPosts({
        subreddit,
        after,
        limit,
      });

      if (response.posts.length === 0) {
        setError("No more posts to load.");
        return;
      }

      cursorStack.current.push({ after, before });
      setPosts(response.posts);
      setAfter(response.after);
      setBefore(response.before);
      updateUrl(response.after, null);
    } catch (err) {
      console.error(err);
      setError("Failed to load next page.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = async () => {
    if (cursorStack.current.length <= 0 || loading) return;

    const prevCursor = cursorStack.current.pop();
    setLoading(true);
    setError(null);

    try {
      const response = await fetchPosts({
        subreddit,
        before: prevCursor?.before || undefined,
        limit,
      });

      setPosts(response.posts);
      setAfter(response.after);
      setBefore(response.before);
      updateUrl(null, response.before);
    } catch (err) {
      console.error(err);
      setError("Failed to load previous page.");
    } finally {
      setLoading(false);
    }
  };

  return {
    posts,
    loading,
    error,
    canGoNext: !!after,
    canGoPrevious: cursorStack.current.length > 0,
    handleNext,
    handlePrevious,
  };
}
