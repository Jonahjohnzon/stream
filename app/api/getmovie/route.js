"use server";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import {EmbedSu} from './servers/embed'
import {Vidsrc} from './servers/vidsrc'

// Cached function that never expires

const subtitleGet =async()=>{
  try{
    const url = 'https://api.opensubtitles.com/api/v1/subtitles';
    const options = {method: 'GET', headers: {'User-Agent': '', 'Api-Key': process.env.SUB_KEY}}
    const data = await response.json();
  }
  catch(err){

  }
}
const fetchAndCacheVideo = unstable_cache(
  async ({ tmdb_id, type, season, episode, server }) => {
  
    let pageUrl;
    const cacheKey = type === "movie"
    ? `${type}-${tmdb_id}-${server}`
    : `${type}-${tmdb_id}-${season}-${episode}-${server}`;
    const embedSu = new EmbedSu();
    const data = await embedSu.fetchSources(tmdb_id, season, episode)
    pageUrl = data?.sources[0]
    if (!pageUrl) {
      throw new Error("Movie not found");
    }

    return { pageUrl };
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
    const vidsrc = new Vidsrc();
    await vidsrc.fetchSources(tmdb_id, season, episode)
   

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
