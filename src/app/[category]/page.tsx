import PostList from "@/components/PostList";
import { fetchPosts } from "@/lib/reddit";

interface Props {
  params: { category: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const category = params.category;
  const limit = searchParams.limit ? Number(searchParams.limit) : 10;
  const after = searchParams.after as string | undefined;
  const before = searchParams.before as string | undefined;

  const { posts, after: nextAfter, before: nextBefore } = await fetchPosts({
    subreddit: category,
    limit,
    after,
    before
  });

  return (
    <PostList
      initialPosts={posts}
      initialAfter={nextAfter}
      initialBefore={nextBefore}
      subreddit={category}
    />
  );
}