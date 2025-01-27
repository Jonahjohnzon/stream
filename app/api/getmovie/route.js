"use server";
import { NextResponse } from "next/server";
import mongoosedb from "../../lib/db";
import puppeteer from "puppeteer-extra";

export const GET = async (req) => {
  let browser;
  try {

    const url = new URL(req.url);
    const tmdb_id = url.searchParams.get("id");
    const type = url.searchParams.get("type");

    if (!tmdb_id || !type) {
      return NextResponse.json(
        { error: "Missing required query parameters (id, type)" },
        { status: 400 }
      );
    }

    const pageUrl = `https://111movies.com/${type}/${tmdb_id}`;

    // Puppeteer setup
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox", // Disables the sandbox
        "--disable-setuid-sandbox", // Disables the setuid sandbox
      ],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
    await page.screenshot({
      path: 'hn.png',
    })
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
      const { requestUrl,  headers } = m3u8Url;

      // Proxy the `.m3u8` request
      return new Response(JSON.stringify({ requestUrl,  headers }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return NextResponse.json({ success: false, error: "M3U8 URL not found" }, { status: 404 });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
