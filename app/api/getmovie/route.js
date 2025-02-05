"use server";
import { NextResponse } from "next/server";
import {getvidsrc} from './servers/embed'
const cache = new Map(); // Simple in-memory cache

export const GET = async (req) => {
  let browser;
  try {
    const url = new URL(req.url);
    const tmdb_id = url.searchParams.get("id");
    const type = url.searchParams.get("type");
    const season = url.searchParams.get("season");
    const episode = url.searchParams.get("episode");
    const server = url.searchParams.get("server");

    if (!tmdb_id || !type || !server) {
      return NextResponse.json(
        { error: "Missing required query parameters (id, type, server)" },
        { status: 400 }
      );
    }

    if (type === "tv" && (!season || !episode)) {
      return NextResponse.json(
        { success: false, error: "Missing season/episode parameters" },
        { status: 400 }
      );
    }

    // Generate a unique cache key based on request parameters
    const cacheKey = type === "movie"
      ? `${type}-${tmdb_id}-${server}`
      : `${type}-${tmdb_id}-${season}-${episode}-${server}`;

    // Check cache before scraping
    if (cache.has(cacheKey)) {
      return NextResponse.json(cache.get(cacheKey), { status: 200 });
    }

    const title =  "Unknown Title";
    
    // Construct the page URL
    let pageUrl ;
    
    if(type == "movie")
     {
      const vidsrcresponse = await getvidsrc({tmdb_id,cacheKey});
      pageUrl = vidsrcresponse      
     }
     else{
      const vidsrcresponse = await getvidsrc({tmdb_id, season, episode,cacheKey});
      pageUrl = vidsrcresponse 
     }

    if (!pageUrl) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 400 }
      );
    }
    const m3u8Url = {
      title, pageUrl
    }
    // Save result in cache
    cache.set(cacheKey, m3u8Url);

    return NextResponse.json(m3u8Url, { status: 200, headers: { "Content-Type": "application/vnd.apple.mpegurl" }
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  } finally {
    if (browser) await browser.close();
  }
};
