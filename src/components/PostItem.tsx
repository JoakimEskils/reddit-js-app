import { Post } from "@/types/reddit";
import { Badge, Box, Link as ChakraLink, HStack, Text, VStack } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import NextImage from "next/image";
import Link from "next/link";

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="md"
      bg={post.is_sticky ? "blue.50" : "white"}
      borderColor={post.is_sticky ? "blue.200" : "gray.200"}
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
    >
      <VStack align="start" spacing={3}>
        <HStack width="100%" justify="space-between">
          <Text fontSize="sm" color="gray.500">
            Posted by u/{post.author} • {formatDistanceToNow(new Date(post.created_utc * 1000))} ago
          </Text>
          {post.is_sticky && (
            <Badge colorScheme="blue" variant="subtle">
              Sticky Post
            </Badge>
          )}
        </HStack>
        
        <Link href={`/post/${post.id}`} style={{ width: '100%' }}>
          <Text fontSize="xl" fontWeight="bold" _hover={{ color: 'blue.500' }}>
            {post.title}
          </Text>
        </Link>

        {post.selftext && (
          <Text fontSize="md" color="gray.600" noOfLines={3}>
            {post.selftext}
          </Text>
        )}

        {post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' && post.thumbnail !== 'nsfw' && post.thumbnail !== 'spoiler' && (
          <Box position="relative" width="100%" height="200px">
            <NextImage
              src={post.thumbnail}
              alt={post.title}
              fill
              style={{ objectFit: "cover", borderRadius: "0.375rem" }}
            />
          </Box>
        )}

        <HStack spacing={4}>
          <Text fontSize="sm" color="gray.500">
            Score: {post.score}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Comments: {post.num_comments}
          </Text>
        </HStack>

        <HStack spacing={4}>
          <Link href={`/post/${post.id}`}>
            <Text color="blue.500" _hover={{ textDecoration: "underline" }}>
              View Post
            </Text>
          </Link>
          <ChakraLink
            href={`https://reddit.com${post.permalink}`}
            isExternal
            color="gray.500"
            _hover={{ textDecoration: "underline" }}
          >
            View on Reddit
          </ChakraLink>
        </HStack>
      </VStack>
    </Box>
  );
}