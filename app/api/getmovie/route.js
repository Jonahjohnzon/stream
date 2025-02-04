"use server";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer-extra";

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

      const urllink = `https://api.themoviedb.org/3/${type}/${tmdb_id}`;
      const response = await fetch(urllink, {
        headers: {
          Authorization: `${process.env.DB_BEARER}`,
          "Content-Type": "application/json",
        },
      });
      const tmdbData = await response.json()
      const title = tmdbData.title || tmdbData.name || "Unknown Title";

    // Construct the page URL
    const pageUrl = type == "movie"
      ? `https://vidlink.pro/movie/${tmdb_id}`
      : `https://vidlink.pro/tv/${tmdb_id}/${season}/${episode}`;

    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(pageUrl, { waitUntil: "domcontentloaded" });

    // Scrape M3U8 URL
    const m3u8Url = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() =>resolve(null), 20000);

      page.on("response", async (response) => {
        try {
          console.log(response)
          const requestUrl = response.url();
          if (requestUrl.includes(".m3u8")) {
            clearTimeout(timeout); 
            const headers = response.request().headers(); 
            resolve({ requestUrl, headers, title });
          }
        } catch (err) {
          clearTimeout(timeout);
          reject(err);
        }
      });

      page.on("error", (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    if (!m3u8Url) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 400 }
      );
    }

    // Save result in cache
    cache.set(cacheKey, m3u8Url);

    return NextResponse.json(m3u8Url, { status: 200 });

  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  } finally {
    if (browser) await browser.close();
  }
};
