# Expo Blog App

A beautiful, feature-rich blog app showcasing Expo Router v7 features with the Expo Changelog RSS feed.

## Features

### Expo Router v7 Features

- **Apple Zoom Transitions**: Native shared element transitions between list and detail views using `sharedTransitionTag`
- **Stack.Toolbar API**: iOS toolbar at the bottom with "Open in Safari" and "Share" actions
- **Native Search**: iOS-style search bar in the header with real-time filtering
- **Link Previews**: Long-press cards to see preview and context menu
- **Context Menus**: Native iOS context menus with "Open in Browser" and "Share" actions
- **Large Title Headers**: iOS-style collapsing large title navigation

### Design & UI

- **@bacons/apple-colors**: Dynamic color system supporting light/dark mode
- **Liquid Glass Effects**: Transparent headers with system blur effects (iOS 26+)
- **Hero Images**: Beautiful post thumbnails with smooth loading transitions
- **Continuous Border Curves**: iOS-style continuous corner radius
- **Pull to Refresh**: Native refresh control for updating the feed
- **Responsive Layout**: Adapts to different screen sizes

## Project Structure

```
src/
├── app/
│   ├── _layout.tsx          # Root stack layout with header config
│   ├── index.tsx             # Blog list screen with search
│   └── post/
│       └── [id].tsx          # Post detail screen with toolbar
├── components/
│   ├── blog-post-card.tsx    # Blog card with Link.Preview
│   └── theme-provider.tsx    # Navigation theme provider
├── contexts/
│   └── posts-context.tsx     # Global posts state management
├── hooks/
│   └── use-search.ts         # Search bar helper hook
└── utils/
    └── rss.ts                # RSS feed fetcher
```

## Tech Stack

- **Expo SDK 55** (beta) with Router v7
- **React 19** with hooks
- **TypeScript** for type safety
- **fast-xml-parser** for RSS parsing
- **@bacons/apple-colors** for adaptive colors
- **expo-glass-effect** for blur effects
- **expo-image** for optimized images
- **expo-symbols** for SF Symbols

## Get started

1. Install dependencies

   ```bash
   bun install
   ```

2. Start the app

   ```bash
   bunx expo
   ```

## Key Implementation Details

### Shared Element Transitions

Images use matching `sharedTransitionTag` props for smooth zoom transitions:

```tsx
// List
<Image sharedTransitionTag={`post-image-${post.id}`} />

// Detail
<Image sharedTransitionTag={`post-image-${post.id}`} />
```

### Stack Toolbar

iOS-only toolbar at the bottom with actions:

```tsx
<Stack.Toolbar>
  <Stack.ToolbarButton title="Open in Safari" icon="safari" onPress={...} />
  <Stack.ToolbarButton title="Share" icon="square.and.arrow.up" onPress={...} />
</Stack.Toolbar>
```

### Native Search

Search bar integrated in the navigation header:

```tsx
const search = useSearch({ placeholder: "Search posts..." });
```

### Link Previews

Cards support preview and context menus:

```tsx
<Link href={...} asChild>
  <Link.Trigger><Pressable>...</Pressable></Link.Trigger>
  <Link.Preview />
  <Link.Menu>
    <Link.MenuAction title="Share" icon="square.and.arrow.up" />
  </Link.Menu>
</Link>
```
