import { Post, Comment } from '@/types/reddit';

interface FetchPostsParams {
  subreddit: string;
  limit?: number;
  after?: string;
  before?: string;
}

interface FetchPostsResponse {
  posts: Post[];
  after: string | null;
  before: string | null;
}

export async function fetchPosts({ subreddit, limit = 10, after, before }: FetchPostsParams): Promise<FetchPostsResponse> {
  try {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    
    if (after) params.append('after', after);
    if (before) params.append('before', before);

    const url = `https://www.reddit.com/r/${subreddit}.json?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Reddit API error: ${response.status} ${response.statusText}`);
      
      if (response.status === 429) {
        throw new Error('Rate limited by Reddit. Please try again later.');
      } else if (response.status === 403) {
        throw new Error('Access denied by Reddit. Please try again later.');
      } else {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
    }

    const data = await response.json();
    
    // Check if we got a blocked page response
    if (data.error || data.message === 'Forbidden' || data.reason === 'banned') {
      throw new Error('Reddit API is unavailable.');
    }

    console.log('Reddit API Response:', {
      url,
      params: params.toString(),
      postsCount: data.data?.children?.length || 0,
      after: data.data?.after,
      before: data.data?.before
    });

    if (!data.data?.children) {
      throw new Error('Invalid response format from Reddit API');
    }

    const posts = data.data.children.map((child: any) => ({
      id: child.data.id,
      title: child.data.title,
      author: child.data.author,
      score: child.data.score,
      num_comments: child.data.num_comments,
      created_utc: child.data.created_utc,
      selftext: child.data.selftext,
      thumbnail: child.data.thumbnail,
      subreddit: child.data.subreddit,
      permalink: child.data.permalink,
      url: child.data.url,
      is_sticky: child.data.stickied || false
    }));

    return {
      posts,
      after: data.data.after || null,
      before: data.data.before || null
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function fetchPostById(postId: string, subreddit: string): Promise<Post> {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/comments/${postId}.json`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Reddit API error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch post: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data?.[0]?.data?.children?.[0]?.data) {
      console.error('Invalid response format from Reddit API:', data);
      throw new Error('Invalid response format from Reddit API');
    }

    const post = data[0].data.children[0].data;
    return {
      id: post.id,
      title: post.title,
      author: post.author,
      score: post.score,
      num_comments: post.num_comments,
      created_utc: post.created_utc,
      selftext: post.selftext,
      thumbnail: post.thumbnail,
      subreddit: post.subreddit,
      permalink: post.permalink,
      url: post.url,
      is_sticky: post.stickied
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

export async function fetchComments(postId: string, subreddit: string): Promise<Comment[]> {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/comments/${postId}.json`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`Reddit API error: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch comments: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data?.[1]?.data?.children) {
      console.error('Invalid response format from Reddit API:', data);
      throw new Error('Invalid response format from Reddit API');
    }

    return data[1].data.children
      .filter((child: any) => child.kind === 't1')
      .map((child: any) => ({
        id: child.data.id,
        author: child.data.author,
        body: child.data.body,
        score: child.data.score,
        created_utc: child.data.created_utc
      }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}