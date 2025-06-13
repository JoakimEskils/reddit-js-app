// src/app/page.tsx

"use client";

import PostList from "@/components/PostList";
import { fetchPosts } from "@/lib/reddit";
import { Post } from "@/types/reddit";
import { Box, Grid, GridItem, HStack, Input, Stack, Text } from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const POST_LIMITS = [5, 10, 15];
const DEFAULT_SUBREDDIT = "javascript";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [after, setAfter] = useState<string | null>(null);
  const [before, setBefore] = useState<string | null>(null);
  const [limit, setLimit] = useState(parseInt(searchParams.get('limit') || '10'));
  const [subreddit, setSubreddit] = useState(searchParams.get('subreddit') || DEFAULT_SUBREDDIT);

  const loadPosts = async (newAfter?: string | null, newBefore?: string | null) => {
    try {
      setLoading(true);
      const currentLimit = parseInt(searchParams.get('limit') || '10');
      const currentAfter = searchParams.get('after') || newAfter || undefined;
      const currentBefore = searchParams.get('before') || newBefore || undefined;
      
      const result = await fetchPosts({
        subreddit,
        limit: currentLimit,
        after: currentAfter,
        before: currentBefore
      });
      setPosts(result.posts);
      setAfter(result.after);
      setBefore(result.before);
      setLimit(currentLimit);
      setError(null);
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only load posts when subreddit or limit changes, not when pagination params change
    loadPosts();
  }, [subreddit, limit]);

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
    
    // Update URL with new limit
    const params = new URLSearchParams(searchParams.toString());
    params.set('limit', newLimit.toString());
    router.push(`?${params.toString()}`);
  };

  const handleSubredditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSubreddit = e.target.value;
    setSubreddit(newSubreddit);
    
    // Update URL with new subreddit
    const params = new URLSearchParams(searchParams.toString());
    params.set('subreddit', newSubreddit);
    router.push(`?${params.toString()}`);
  };

  return (
    <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={8}>
      <GridItem>
        <Box bg="white" borderRadius="md" p={4} mb={4}>
          <Stack gap={4}>
            <HStack>
              <Input
                placeholder="Enter subreddit"
                value={subreddit}
                onChange={handleSubredditChange}
                size="lg"
                bg="gray.50"
                _hover={{ bg: "white" }}
                _focus={{ bg: "white", borderColor: "reddit.blue" }}
              />
              <Box>
                <select
                  value={limit}
                  onChange={handleLimitChange}
                  style={{
                    padding: '0.75rem',
                    fontSize: '1rem',
                    backgroundColor: '#F7FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '0.375rem',
                    width: '100%',
                    minWidth: '120px',
                    cursor: 'pointer'
                  }}
                >
                  {POST_LIMITS.map((l) => (
                    <option key={l} value={l}>
                      {l} posts
                    </option>
                  ))}
                </select>
              </Box>
            </HStack>
          </Stack>
        </Box>
        {error && (
          <Box bg="red.50" color="red.500" p={4} borderRadius="md" mb={4}>
            {error}
          </Box>
        )}
        {loading ? (
          <Box textAlign="center" py={8}>
            <Text>Loading posts...</Text>
          </Box>
        ) : (
          <PostList
            initialPosts={posts}
            initialAfter={after}
            initialBefore={before}
            subreddit={subreddit}
          />
        )}
      </GridItem>
    </Grid>
  );
}
