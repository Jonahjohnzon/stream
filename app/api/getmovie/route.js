"use server";
import { NextResponse } from "next/server";
import mongoosedb from "../../lib/db"; // Your DB connection
import puppeteer from "puppeteer-extra";
import movie from '@/app/lib/models/movie'
export const GET = async (req) => {
  await mongoosedb()
  let browser;
  try {
    const url = new URL(req.url);
    const tmdb_id = url.searchParams.get("id");
    const type = url.searchParams.get("type");
    const season = url.searchParams.get("season");
    const episode = url.searchParams.get("episode");

    if (!tmdb_id || !type) {
      return NextResponse.json(
        { error: "Missing required query parameters (id, type)" },
        { status: 400 }
      );
    }

    let existingData;
    if(type == "movie")
    {
    existingData = await movie.findOne({ tmdb_id, type });
    }
    else{
    existingData = await movie.findOne({ tmdb_id, type, season, episode });
    }

    if (existingData) {
      return NextResponse.json(existingData, { status: 200 });
    }

    const tmdbUrl =
      type === "movie"
        ? `https://api.themoviedb.org/3/movie/${tmdb_id}`
        : `https://api.themoviedb.org/3/tv/${tmdb_id}`;
    const tmdbResponse = await fetch(tmdbUrl, {
      headers: {
        Authorization: `${process.env.DB_BEARER}`,
        "Content-Type": "application/json",
      },
    });

    const tmdbData = await tmdbResponse.json();
    const title = tmdbData.title || tmdbData.name || "Unknown Title";

    let pageUrl = "";
    if (type === "movie") {
      pageUrl = `https://vidlink.pro/${type}/${tmdb_id}`;
    } else {
      if (!season || !episode) {
        return NextResponse.json(
          { error: "Missing required query parameters (season, episode)" },
          { status: 400 }
        );
      }
      pageUrl = `https://vidlink.pro/${type}/${tmdb_id}/${season}/${episode}`;
    }

    // Puppeteer setup
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.goto(pageUrl, { waitUntil: "domcontentloaded" });

    const m3u8Url = await new Promise((resolve, reject) => {
      page.on("response", async (response) => {
        try {
          const requestUrl = response.url();
          if (requestUrl.includes(".m3u8")) {
            const headers = response.request().headers(); // Required headers
            resolve({ requestUrl, headers });
          }
        } catch (err) {
          reject(err);
        }
      });

      page.on("error", (err) => reject(err));
    });

    if (m3u8Url) {
      const { requestUrl, headers } = m3u8Url;

      const newData = new movie({
        tmdb_id,
        type,
        season,
        episode,
        title,
        requestUrl,
        headers,
      });

      await newData.save();

      return NextResponse.json(
        { requestUrl, headers, title, success: true },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, error: "M3U8 URL not found", title },
      { status: 404 }
    );
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
