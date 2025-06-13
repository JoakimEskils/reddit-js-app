export interface Post {
  id: string;
  title: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  selftext: string;
  thumbnail: string;
  subreddit: string;
  permalink: string;
  url: string;
  is_sticky: boolean;
}

export interface Comment {
  id: string;
  author: string;
  body: string;
  score: number;
  created_utc: number;
} 