import { BlogPost } from "@/utils/rss";
import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link href={`/post/${encodeURIComponent(post.id)}`} asChild>
      <Link.Trigger>
        <Pressable
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
            marginHorizontal: 16,
            marginVertical: 8,
            backgroundColor: AC.secondarySystemGroupedBackground,
            borderRadius: 16,
            borderCurve: "continuous",
            overflow: "hidden",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          })}
        >
          {post.thumbnail && (
            <Image
              source={{ uri: post.thumbnail }}
              style={{ width: "100%", height: 200 }}
              contentFit="cover"
              transition={200}
              sharedTransitionTag={`post-image-${post.id}`}
            />
          )}
          <View style={{ padding: 16 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "600",
                color: AC.label,
                marginBottom: 8,
              }}
              numberOfLines={2}
              selectable
            >
              {post.title}
            </Text>
            {post.description && (
              <Text
                style={{
                  fontSize: 15,
                  color: AC.secondaryLabel,
                  marginBottom: 8,
                  lineHeight: 20,
                }}
                numberOfLines={3}
                selectable
              >
                {post.description}
              </Text>
            )}
            <Text
              style={{
                fontSize: 13,
                color: AC.tertiaryLabel,
                fontVariant: ["tabular-nums"],
              }}
              selectable
            >
              {post.formattedDate}
            </Text>
          </View>
        </Pressable>
      </Link.Trigger>
      <Link.Preview />
      <Link.Menu>
        <Link.MenuAction
          title="Open in Browser"
          icon="safari"
          onPress={() => {
            if (typeof window !== "undefined") {
              window.open(post.link, "_blank");
            }
          }}
        />
        <Link.MenuAction
          title="Share"
          icon="square.and.arrow.up"
          onPress={() => {
            console.log("Share:", post.link);
          }}
        />
      </Link.Menu>
    </Link>
  );
}
