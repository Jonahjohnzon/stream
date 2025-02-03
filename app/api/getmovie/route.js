"use server";
import { NextResponse } from "next/server";
import mongoosedb from "../../lib/db"; // Your DB connection
import movie from '@/app/lib/models/movie'
export const GET = async (req) => {
  await mongoosedb()
  try {
    const url = new URL(req.url);
    const tmdb_id = url.searchParams.get("id");
    const type = url.searchParams.get("type");
    const season = url.searchParams.get("season");
    const episode = url.searchParams.get("episode");
    const server = url.searchParams.get('server')

    if (!tmdb_id || !type || !server) {
      return NextResponse.json(
        { error: "Missing required query parameters (id, type)" },
        { status: 400 }
      );
    }

    let existingData;
    if(type == "movie")
    {
    existingData = await movie.findOne({ tmdb_id, type , server});
    }
    else{
    existingData = await movie.findOne({ tmdb_id, type, season, episode , server});
    }

    if (existingData) {
      return NextResponse.json(existingData, { status: 200 });
    }

    return NextResponse.json(
      { success: false, error: "M3U8 URL not found" },
      { status: 404 }
    );
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
};
