"use client";

import React from "react";
import PostItem from "./PostItem";
import { Post } from "@/types/reddit";
import {
  Box,
  Button,
  Stack,
  Alert,
  AlertIcon,
  Spinner,
} from "@chakra-ui/react";
import { usePagination } from "@/hooks/usePagination";

interface PostListProps {
  initialPosts: Post[];
  initialAfter: string | null;
  initialBefore: string | null;
  subreddit: string;
}

export default function PostList({
  initialPosts,
  initialAfter,
  initialBefore,
  subreddit,
}: PostListProps) {
  const {
    posts,
    loading,
    error,
    canGoPrevious,
    canGoNext,
    handlePrevious,
    handleNext,
  } = usePagination({
    initialPosts,
    initialAfter,
    initialBefore,
    subreddit,
  });

  return (
    <Stack spacing={4}>
      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

      {posts.map((post) => (
        <Box key={post.id}>
          <PostItem post={post} />
        </Box>
      ))}

      <Stack direction="row" spacing={4} justify="center" align="center">
        <Button
          onClick={handlePrevious}
          isDisabled={!canGoPrevious || loading}
          variant="outline"
        >
          Previous
        </Button>
        <Button onClick={handleNext} isDisabled={!canGoNext || loading}>
          {loading ? <Spinner size="sm" /> : "Next"}
        </Button>
      </Stack>
    </Stack>
  );
}
