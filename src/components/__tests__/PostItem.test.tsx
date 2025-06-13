import { render, screen } from "@testing-library/react";
import PostItem from "../PostItem";
import { Post } from '@/types/reddit';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // Convert boolean attributes to strings
    const convertedProps = {
      ...props,
      fill: props.fill?.toString(),
      priority: props.priority?.toString(),
    };
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...convertedProps} />;
  },
}));

describe("PostItem", () => {
  const mockPost: Post = {
    id: "123",
    title: "Test Post",
    author: "testuser",
    score: 100,
    num_comments: 50,
    created_utc: Math.floor(Date.now() / 1000),
    selftext: "Test content",
    thumbnail: "https://example.com/image.jpg",
    subreddit: "javascript",
    permalink: "/r/javascript/comments/123/test-post",
    url: "https://example.com",
    is_sticky: false
  };

  it("renders post information correctly", () => {
    render(<PostItem post={mockPost} />);

    // Check if title is rendered
    expect(screen.getByText("Test Post")).toBeInTheDocument();

    // Check if author is rendered
    expect(screen.getByText(/Posted by u\/testuser/)).toBeInTheDocument();

    // Check if score is rendered
    expect(screen.getByText("Score: 100")).toBeInTheDocument();

    // Check if comments are rendered
    expect(screen.getByText("Comments: 50")).toBeInTheDocument();

    // Check if date is rendered
    expect(screen.getByText("View on Reddit")).toBeInTheDocument();
  });

  it("renders image when thumbnail is valid", () => {
    render(<PostItem post={mockPost} />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it("does not render image when thumbnail is invalid", () => {
    const postWithoutThumbnail = { ...mockPost, thumbnail: 'self' };
    render(<PostItem post={postWithoutThumbnail} />);
    
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it("shows sticky badge for sticky posts", () => {
    const stickyPost = { ...mockPost, is_sticky: true };
    render(<PostItem post={stickyPost} />);
    
    expect(screen.getByText('Sticky Post')).toBeInTheDocument();
  });
}); 