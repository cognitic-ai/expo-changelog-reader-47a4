import { XMLParser } from "fast-xml-parser";

export interface BlogPost {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  thumbnail?: string;
  formattedDate: string;
}

export interface RSSFeed {
  title: string;
  description: string;
  posts: BlogPost[];
}

const RSS_URL = "https://expo.dev/changelog/rss.xml";

export async function fetchRSSFeed(): Promise<RSSFeed> {
  try {
    const url = process.env.EXPO_OS === "web"
      ? `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`
      : RSS_URL;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    const result = parser.parse(xmlText);
    const channel = result.rss.channel;
    const items = Array.isArray(channel.item) ? channel.item : [channel.item];

    const posts: BlogPost[] = items.map((item: any) => {
      const pubDate = new Date(item.pubDate);
      const formattedDate = pubDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      return {
        id: item.guid["#text"] || item.guid,
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description,
        thumbnail: item["media:thumbnail"]?.["@_url"],
        formattedDate,
      };
    });

    return {
      title: channel.title,
      description: channel.description,
      posts,
    };
  } catch (error) {
    console.error("Failed to fetch RSS feed:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    throw error;
  }
}
