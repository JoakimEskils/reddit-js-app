import { fetchPosts, fetchPostById, fetchComments } from '../reddit';
import { Post, Comment } from '@/types/reddit';

// Mock the global fetch function
global.fetch = jest.fn();

describe('Reddit API', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('fetchPosts', () => {
    it('fetches posts successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve({
          data: {
            children: [
              {
                data: {
                  id: '123',
                  title: 'Test Post',
                  author: 'testuser',
                  score: 100,
                  num_comments: 50,
                  created_utc: 1234567890,
                  selftext: 'Test content',
                  thumbnail: 'https://example.com/image.jpg',
                  subreddit: 'javascript',
                  permalink: '/r/javascript/comments/123/test_post',
                  url: 'https://reddit.com/r/javascript/comments/123/test_post',
                  stickied: false
                }
              }
            ],
            after: 't3_123',
            before: 't3_456'
          }
        })
      };

      // Mock the fetch call
      (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve(mockResponse));

      const result = await fetchPosts({ subreddit: 'javascript', limit: 10 });

      expect(result.posts).toHaveLength(1);
      expect(result.posts[0]).toEqual({
        id: '123',
        title: 'Test Post',
        author: 'testuser',
        score: 100,
        num_comments: 50,
        created_utc: 1234567890,
        selftext: 'Test content',
        thumbnail: 'https://example.com/image.jpg',
        subreddit: 'javascript',
        permalink: '/r/javascript/comments/123/test_post',
        url: 'https://reddit.com/r/javascript/comments/123/test_post',
        is_sticky: false
      });
      expect(result.after).toBe('t3_123');
      expect(result.before).toBe('t3_456');
    });

    it('handles API errors', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve(mockErrorResponse));

      await expect(fetchPosts({ subreddit: 'nonexistent' })).rejects.toThrow('Failed to fetch posts: Not Found');
    });
  });

  describe('fetchPostById', () => {
    it('fetches a single post successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([
          {
            data: {
              children: [
                {
                  data: {
                    id: '123',
                    title: 'Test Post',
                    author: 'testuser',
                    score: 100,
                    num_comments: 50,
                    created_utc: 1234567890,
                    selftext: 'Test content',
                    thumbnail: 'https://example.com/image.jpg',
                    subreddit: 'javascript',
                    permalink: '/r/javascript/comments/123/test_post',
                    url: 'https://reddit.com/r/javascript/comments/123/test_post',
                    stickied: false
                  }
                }
              ]
            }
          }
        ])
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve(mockResponse));

      const result = await fetchPostById('123', 'javascript');

      expect(result).toEqual({
        id: '123',
        title: 'Test Post',
        author: 'testuser',
        score: 100,
        num_comments: 50,
        created_utc: 1234567890,
        selftext: 'Test content',
        thumbnail: 'https://example.com/image.jpg',
        subreddit: 'javascript',
        permalink: '/r/javascript/comments/123/test_post',
        url: 'https://reddit.com/r/javascript/comments/123/test_post',
        is_sticky: false
      });
    });

    it('handles API errors', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve(mockErrorResponse));

      await expect(fetchPostById('nonexistent', 'javascript')).rejects.toThrow('Failed to fetch post: Not Found');
    });
  });

  describe('fetchComments', () => {
    it('fetches comments successfully', async () => {
      const mockResponse = {
        ok: true,
        json: () => Promise.resolve([
          {
            data: {
              children: [
                {
                  data: {
                    id: 'post123',
                    title: 'Test Post'
                  }
                }
              ]
            }
          },
          {
            data: {
              children: [
                {
                  kind: 't1',
                  data: {
                    id: 'comment1',
                    author: 'commenter1',
                    body: 'Test comment',
                    score: 10,
                    created_utc: 1234567890
                  }
                }
              ]
            }
          }
        ])
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve(mockResponse));

      const result = await fetchComments('123', 'javascript');

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'comment1',
        author: 'commenter1',
        body: 'Test comment',
        score: 10,
        created_utc: 1234567890
      });
    });

    it('handles API errors', async () => {
      const mockErrorResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };

      (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve(mockErrorResponse));

      await expect(fetchComments('nonexistent', 'javascript')).rejects.toThrow('Failed to fetch comments: Not Found');
    });
  });
}); 