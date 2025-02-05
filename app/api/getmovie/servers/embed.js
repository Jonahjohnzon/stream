export class EmbedSu {
    constructor() {
        this.DOMAIN = "https://embed.su";
        this.USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
        this.headers = {
            'User-Agent': this.USER_AGENT,
            'Referer': this.DOMAIN,
            'Origin': this.DOMAIN,
        };
    }

    stringAtob(inputStr) {
        try {
            return Buffer.from(inputStr, 'base64').toString('utf-8');
        } catch (error) {
            throw new Error("Base64 decoding failed: " + error.message);
        }
    }

    async requestGet(url, headers = this.headers, parseJson = true) {
        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return parseJson ? response.json() : response.text();
        } catch (error) {
            return "";
        }
    }

    async fetchSources(tmdbId, season = null, episode = null) {
        try {
            const urlSearch = season && episode 
                ? `${this.DOMAIN}/embed/tv/${tmdbId}/${season}/${episode}`
                : `${this.DOMAIN}/embed/movie/${tmdbId}`;

            const textSearch = await this.requestGet(urlSearch, this.headers, false);
            const hashEncodeMatch = textSearch.match(/JSON\.parse\(atob\(`([^`]+)`\)\)/i);
            const hashEncode = hashEncodeMatch ? hashEncodeMatch[1] : "";

            if (!hashEncode) return this._emptyResult();

            const hashDecode = JSON.parse(this.stringAtob(hashEncode));
            const mEncrypt = hashDecode.hash;

            if (!mEncrypt) return this._emptyResult();

            const firstDecode = this.stringAtob(mEncrypt).split(".").map(item => item.split('').reverse().join(''));
            const secondDecode = JSON.parse(this.stringAtob(firstDecode.join('').split('').reverse().join('')));

            if (!secondDecode || secondDecode.length === 0) return this._emptyResult();

            for (const item of secondDecode) {
                if (item.name.toLowerCase() !== "viper") continue;

                const urlDirect = `${this.DOMAIN}/api/e/${item.hash}`;
                const dataDirect = await this.requestGet(urlDirect, {
                    "Referer": "https://embed.su/",
                    "User-Agent": this.USER_AGENT,
                    "Accept": "*/*"
                });

                if (!dataDirect || !dataDirect.source) continue;

                return {
                    sources: [{
                        quality: "Auto",
                        file: dataDirect.source.replace('https://embed.su/api/proxy/viper/', 'https://')
                    }]
                };
            }
            return this._emptyResult();

        } catch (error) {
            return this._emptyResult();
        }
    }

    _emptyResult() {
        return { sources: [] };
    }
}


