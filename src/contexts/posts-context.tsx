import { BlogPost, fetchRSSFeed } from "@/utils/rss";
import { createContext, useContext, useEffect, useState } from "react";

interface PostsContextType {
  posts: BlogPost[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  refresh: () => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = async (isRefresh = false) => {
    try {
      setError(null);
      const feed = await fetchRSSFeed();
      setPosts(feed.posts);
    } catch (error) {
      console.error("Failed to load feed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to load posts";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refresh = () => {
    setRefreshing(true);
    loadFeed(true);
  };

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <PostsContext.Provider value={{ posts, loading, refreshing, error, refresh }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
}
