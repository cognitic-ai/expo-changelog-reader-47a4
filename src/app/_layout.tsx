import { ThemeProvider } from "@/components/theme-provider";
import { PostsProvider } from "@/contexts/posts-context";
import Stack from "expo-router/stack";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import * as AC from "@bacons/apple-colors";

const AppleStackPreset: NativeStackNavigationOptions =
  process.env.EXPO_OS !== "ios"
    ? {}
    : isLiquidGlassAvailable()
    ? {
        headerTransparent: true,
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: {
          backgroundColor: "transparent",
        },
        headerTitleStyle: {
          color: AC.label as any,
        },
        headerBlurEffect: "none",
        headerBackButtonDisplayMode: "minimal",
      }
    : {
        headerTransparent: true,
        headerShadowVisible: true,
        headerLargeTitleShadowVisible: false,
        headerLargeStyle: {
          backgroundColor: "transparent",
        },
        headerBlurEffect: "systemChromeMaterial",
        headerBackButtonDisplayMode: "default",
      };

export default function Layout() {
  return (
    <ThemeProvider>
      <PostsProvider>
        <Stack screenOptions={AppleStackPreset}>
          <Stack.Screen
            name="index"
            options={{
              title: "Expo Blog",
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen
            name="post/[id]"
            options={{
              title: "",
              headerLargeTitle: false,
              presentation: "default",
            }}
          />
        </Stack>
      </PostsProvider>
    </ThemeProvider>
  );
}
