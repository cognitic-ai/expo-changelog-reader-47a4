import { usePosts } from "@/contexts/posts-context";
import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  Share,
  Alert,
} from "react-native";
import { SymbolView } from "expo-symbols";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { posts, loading } = usePosts();
  const navigation = useNavigation();

  const post = useMemo(() => {
    return posts.find((p) => p.id === decodeURIComponent(id));
  }, [posts, id]);

  useEffect(() => {
    if (post) {
      navigation.setOptions({
        title: post.title,
        headerRight: () => (
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              {process.env.EXPO_OS === "ios" ? (
                <SymbolView
                  name="square.and.arrow.up"
                  size={22}
                  tintColor={AC.systemBlue}
                />
              ) : (
                <Text style={{ color: AC.systemBlue, fontSize: 16 }}>
                  Share
                </Text>
              )}
            </Pressable>
          </View>
        ),
      });
    }
  }, [post]);

  const handleShare = async () => {
    if (!post) return;
    try {
      await Share.share({
        message: `${post.title}\n\n${post.link}`,
        url: post.link,
      });
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  const handleOpenInBrowser = async () => {
    if (!post?.link) return;
    try {
      await WebBrowser.openBrowserAsync(post.link);
    } catch (error) {
      console.error("Failed to open browser:", error);
      Alert.alert("Error", "Failed to open browser");
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: AC.systemBackground,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={AC.systemBlue} />
      </View>
    );
  }

  if (!post) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: AC.systemBackground,
          justifyContent: "center",
          alignItems: "center",
          padding: 32,
        }}
      >
        <Text style={{ fontSize: 17, color: AC.secondaryLabel }}>
          Post not found
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: AC.systemBackground }}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {post.thumbnail && (
          <Image
            source={{ uri: post.thumbnail }}
            style={{ width: "100%", height: 300 }}
            contentFit="cover"
            transition={300}
            sharedTransitionTag={`post-image-${post.id}`}
          />
        )}

        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: AC.label,
              marginBottom: 8,
              lineHeight: 34,
            }}
            selectable
          >
            {post.title}
          </Text>

          <Text
            style={{
              fontSize: 15,
              color: AC.tertiaryLabel,
              marginBottom: 24,
              fontVariant: ["tabular-nums"],
            }}
            selectable
          >
            {post.formattedDate}
          </Text>

          {post.description && (
            <Text
              style={{
                fontSize: 17,
                color: AC.label,
                lineHeight: 26,
                marginBottom: 32,
              }}
              selectable
            >
              {post.description}
            </Text>
          )}

          <Pressable
            onPress={handleOpenInBrowser}
            style={({ pressed }) => ({
              backgroundColor: AC.systemBlue,
              padding: 16,
              borderRadius: 12,
              borderCurve: "continuous",
              alignItems: "center",
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <Text
              style={{
                color: "white",
                fontSize: 17,
                fontWeight: "600",
              }}
            >
              Read Full Article
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <Stack.Toolbar>
        <Stack.Toolbar.Button
          title="Open in Safari"
          icon="safari"
          onPress={handleOpenInBrowser}
        />
        <Stack.Toolbar.Button
          title="Share"
          icon="square.and.arrow.up"
          onPress={handleShare}
        />
      </Stack.Toolbar>
    </View>
  );
}
