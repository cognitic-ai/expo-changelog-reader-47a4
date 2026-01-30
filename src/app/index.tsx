import { BlogPostCard } from "@/components/blog-post-card";
import { usePosts } from "@/contexts/posts-context";
import useSearch from "@/hooks/use-search";
import * as AC from "@bacons/apple-colors";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  View,
} from "react-native";

export default function BlogListScreen() {
  const { posts, loading, refreshing, error, refresh } = usePosts();

  const search = useSearch({
    placeholder: "Search posts...",
  });

  const filteredPosts = posts.filter((post) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      post.title.toLowerCase().includes(searchLower) ||
      post.description?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: AC.systemGroupedBackground,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={AC.systemBlue} />
        {error && (
          <Text
            style={{
              fontSize: 15,
              color: AC.systemRed,
              marginTop: 16,
              textAlign: "center",
              paddingHorizontal: 32,
            }}
            selectable
          >
            {error}
          </Text>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: AC.systemGroupedBackground }}>
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BlogPostCard post={item} />}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingTop: process.env.EXPO_OS === "web" ? 80 : 0,
          paddingBottom: 16,
        }}
        ListEmptyComponent={
          <View style={{ padding: 32, alignItems: "center" }}>
            <Text style={{ fontSize: 17, color: AC.secondaryLabel }}>
              {error ? error : "No posts found"}
            </Text>
            {error && (
              <Text
                style={{
                  fontSize: 15,
                  color: AC.tertiaryLabel,
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Pull to refresh to try again
              </Text>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={AC.systemBlue}
          />
        }
      />
    </View>
  );
}
