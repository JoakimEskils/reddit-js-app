import { fetchComments, fetchPostById } from '@/lib/reddit'
import { Box, Container, Flex, Heading, Image, Text } from '@chakra-ui/react'

interface PostPageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await fetchPostById(params.id, 'javascript')

  if (!post) {
    return (
      <Container maxW="container.lg" py={8}>
        <Text>Post not found</Text>
      </Container>
    )
  }

  const comments = await fetchComments(post.id, post.subreddit)

  return (
    <Container maxW="container.lg" py={8}>
      <Box 
        p={6} 
        borderWidth="1px" 
        borderRadius="lg" 
        borderColor="gray.200"
        bg="white"
        mb={8}
      >
        <Heading as="h1" size="xl" mb={4}>
          {post.title}
        </Heading>
        
        <Flex gap={4} mb={6} fontSize="sm" color="gray.600">
          <Text>Posted by u/{post.author}</Text>
          <Text>Score: {post.score}</Text>
          <Text>{post.num_comments} comments</Text>
          <Text>{new Date(post.created_utc * 1000).toLocaleDateString()}</Text>
        </Flex>

        {post.thumbnail && post.thumbnail !== 'self' && (
          <Image
            src={post.thumbnail}
            alt={post.title}
            maxH="512px"
            objectFit="contain"
            borderRadius="md"
            mb={6}
          />
        )}

        {post.selftext && (
          <Text fontSize="lg" color="gray.700" whiteSpace="pre-wrap" mb={6}>
            {post.selftext}
          </Text>
        )}

        <Box as="hr" my={6} borderColor="gray.200" />

        {/* Comments Section */}
        <Box>
          <Heading as="h2" size="lg" mb={4}>
            Comments ({comments.length})
          </Heading>
          
          {comments.length === 0 ? (
            <Text color="gray.500">No comments yet</Text>
          ) : (
            <Flex direction="column" gap={4}>
              {comments.map((comment) => (
                <Box 
                  key={comment.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor="gray.100"
                  bg="gray.50"
                >
                  <Flex gap={2} mb={2} fontSize="sm" color="gray.600">
                    <Text fontWeight="bold">u/{comment.author}</Text>
                    <Text>•</Text>
                    <Text>{new Date(comment.created_utc * 1000).toLocaleDateString()}</Text>
                    <Text>•</Text>
                    <Text>Score: {comment.score}</Text>
                  </Flex>
                  <Text color="gray.700">{comment.body}</Text>
                </Box>
              ))}
            </Flex>
          )}
        </Box>
      </Box>
    </Container>
  )
} 