import { NextResponse } from "next/server";
import { INSTAGRAM_POSTS } from "@/data/instagram-posts";

export interface OEmbedResult {
  url: string;
  thumbnail_url: string;
  permalink: string;
}

// In-memory cache
let cache: { data: OEmbedResult[]; timestamp: number } | null = null;
const CACHE_MS = 60 * 60 * 1000; // 1 hour

export async function GET() {
  // Return cache if fresh
  if (cache && Date.now() - cache.timestamp < CACHE_MS) {
    return NextResponse.json({ posts: cache.data });
  }

  const results: OEmbedResult[] = [];

  for (const url of INSTAGRAM_POSTS.slice(0, 6)) {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v21.0/instagram_oembed?url=${encodeURIComponent(url)}&omit_script=true&maxwidth=480`,
        { next: { revalidate: 3600 } }
      );

      if (res.ok) {
        const data = await res.json();
        // Extract thumbnail from the oembed HTML
        const thumbMatch = data.html?.match(/src="([^"]+)"/);
        if (data.thumbnail_url || thumbMatch) {
          results.push({
            url,
            thumbnail_url: data.thumbnail_url ?? thumbMatch?.[1] ?? "",
            permalink: url,
          });
        }
      }
    } catch {
      // Skip failed posts
    }
  }

  if (results.length > 0) {
    cache = { data: results, timestamp: Date.now() };
  }

  return NextResponse.json({ posts: results });
}
