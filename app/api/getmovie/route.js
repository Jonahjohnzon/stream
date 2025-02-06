"use server";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import {EmbedSu} from './servers/embed'
import {Vidsrc} from './servers/vidsrc'


const TMDB_API_KEY = process.env.DB_BEARER;

async function fetchTitleFromTMDB(tmdb_id, type) {
  const url = `https://api.themoviedb.org/3/${type}/${tmdb_id}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `${TMDB_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.title || data.name || "Title"; // 'title' for movies, 'name' for TV shows
  } catch (error) {
    console.error("Error fetching title from TMDB:", error);
    return "Unknown Title";
  }
}


const fetchAndCacheVideo = unstable_cache(
  async ({ tmdb_id, type, season, episode, server }) => {
  
    let pageUrl;
    const embedSu = new EmbedSu();
    let data ;
    if(server == "1")
    {
    data = await embedSu.fetchSources(tmdb_id, season, episode)
    }
    pageUrl = data?.sources[0]
    if (!pageUrl) {
      throw new Error("Movie not found");
    }
    const title = await fetchTitleFromTMDB(tmdb_id, type);

    return { pageUrl, title };
  },
  (params) => `${params.type}-${params.tmdb_id}-${params.season || "0"}-${params.episode || "0"}-${params.server}`
);

export const GET = async (req) => {
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
    // const vidsrc = new Vidsrc();
    // // await vidsrc.fetchSources("vidsrc",tmdb_id, season, episode)
   

    const m3u8Url = await fetchAndCacheVideo({ tmdb_id, type, season, episode, server });

    return NextResponse.json(m3u8Url, { 
      status: 200, 
      headers: { "Content-Type": "application/vnd.apple.mpegurl" } 
    });

  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
};
