import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import base64 from "base-64";

export class Vidsrc {
  async fetchHTML(url, referer = null) {
    const headers = referer ? { Referer: referer } : {};
    const res = await fetch(url, { headers });
    return res.text();
  }

  async handleVidSrcStream(url, source) {
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const text = await this.fetchHTML(url, source);
        let hlsUrl = text.match(/file:"([^"]*)"/)?.[1]?.replace(/\/\/\S+?=/, "").replace("#2", "");
        if (hlsUrl) return base64.decode(hlsUrl);
      } catch {}
    }
    return null;
  }

  async fetchSources(name, tmdbId, season = null, episode = null) {
    let url = `https://vidsrc.me/embed/${season && episode ? "tv" : "movie"}?tmdb=${tmdbId}`;
    if (season && episode) url += `&season=${season}&episode=${episode}`;

    const doc = new JSDOM(await this.fetchHTML(url)).window.document;
    console.log([...doc.querySelectorAll(".server")].find(el => el.textContent.trim() === name))
    const source = [...doc.querySelectorAll(".server")].find(el => el.textContent.trim() === name)?.getAttribute("data-hash");
    if (!source) return null;
    
    return
    const doc1 = new JSDOM(await this.fetchHTML(`https://rcp.vidsrc.me/rcp/${source}`, url)).window.document;
    let decodedUrl = this.decodeSrc(doc1.querySelector("#hidden")?.getAttribute("data-h"), doc1.body.getAttribute("data-i"));
    if (decodedUrl.startsWith("//")) decodedUrl = `https:${decodedUrl}`;

    const res = await fetch(decodedUrl, { headers: { Referer: `https://rcp.vidsrc.me/rcp/${source}` }, redirect: "manual" });
    return res.headers.get("location")?.includes("vidsrc.stream") ? await this.handleVidSrcStream(res.headers.get("location"), url) : res.headers.get("location");
  }

  decodeSrc(encoded, seed) {
    return Buffer.from(encoded, "hex").map((b, i) => b ^ seed.charCodeAt(i % seed.length)).toString("utf-8");
  }
}


