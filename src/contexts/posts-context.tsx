import { BlogPost, fetchRSSFeed } from "@/utils/rss";
import { createContext, useContext, useEffect, useState } from "react";

interface PostsContextType {
  posts: BlogPost[];
  loading: boolean;
  refreshing: boolean;
  refresh: () => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadFeed = async (isRefresh = false) => {
    try {
      const feed = await fetchRSSFeed();
      setPosts(feed.posts);
    } catch (error) {
      console.error("Failed to load feed:", error);
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
    <PostsContext.Provider value={{ posts, loading, refreshing, refresh }}>
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
