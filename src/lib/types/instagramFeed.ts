export type InstagramFeedPost = {
  id: string;
  caption: string | null;
  imageUrl: string;
  permalink: string;
  timestamp: string | null;
};

export type InstagramFeedFile = {
  fetchedAt: string | null;
  username: string | null;
  posts: InstagramFeedPost[];
};
