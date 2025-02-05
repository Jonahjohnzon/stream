"use server"
import  saveM3U8File from './save'
import {uploadToR2} from './r2'
export async function getvidsrc({tmdb_id, season, episode,cacheKey}) {
  const DOMAIN = "https://embed.su";
  const headers = {
    'user-agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    'Referer': `${DOMAIN}`,
    'Origin': `${DOMAIN}`,
  };

  try {
    let urlSearch = '';

    if(season && episode){
      urlSearch = `${DOMAIN}/embed/tv/${tmdb_id}/${season}/${episode}`;
    } else {
      urlSearch = `${DOMAIN}/embed/movie/${tmdb_id}`;
    }
    
    const htmlSearch = await fetch(urlSearch, {
      method: 'GET',
      headers: headers,
    });
    const textSearch = await htmlSearch.text();

    const hashEncodeMatch = textSearch.match(/JSON\.parse\(atob\(\`([^\`]+)/i);
    const hashEncode = hashEncodeMatch ? hashEncodeMatch[1] : "";

    if (!hashEncode) {
      return;
    }

    const hashDecode = JSON.parse(await string_atob(hashEncode));

    const mEncrypt = hashDecode.hash;
    if (!mEncrypt) {
      return;
    }

    const firstDecode = (await string_atob(mEncrypt)).split(".").map(item => item.split("").reverse().join(""));
    const secondDecode = JSON.parse(await string_atob(firstDecode.join("").split("").reverse().join("")));

    if (!secondDecode || secondDecode.length == 0) {
      return;
    }
    for (let i = 0; i < secondDecode.length; i++) {
      const item = secondDecode[i];
      if (item.name.toLowerCase() != "viper") {
        continue;
      }

      const urlDirect = `${DOMAIN}/api/e/${item.hash}`;
      const dataDirect = await request_get(urlDirect, {
        "Referer": "https://embed.su/",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "*/*"
      }, false);

      if (!dataDirect.source) {
        continue;
      }

      const tracks = [];
      try {
        for (let j = 0; j < dataDirect.subtitles.length; j++) {
          const itemTrack = dataDirect.subtitles[j];
          const labelMatch = itemTrack.label.match(/^([A-z]+)/i);
          const label = labelMatch ? labelMatch[1] : "";
          if (!label) {
            continue;
          }
          tracks.push({
            url: itemTrack.file,
            lang: label
          });
        }
      } catch (etrack) { }

      const requestDirectSize = await fetch(dataDirect.source, {
        headers: {
          "Referer":  `${DOMAIN}`,
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "*/*"
        },
        method: "GET",
      });
      const parseRequest = await requestDirectSize.text();
      const updatedM3U8 = parseRequest
      .replace(/\.png/g, '.m3u8') // Replace all .png occurrences with .m3u8
      .replace(/\/api\/proxy\/viper/g, 'https:/'); // Replace proxy path with https://
      const fileName = `${cacheKey}.m3u8`
      const data = await uploadToR2("vidstream", fileName, updatedM3U8);
      console.log(data)


      // saveM3U8File(cacheKey,updatedM3U8)
      const results = {
        headers: {
          "Referer": "https://embed.su/",
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "*/*"
        },
        sources: data.Location,
      };

      return results;
    }
  } catch (e) {
    console.log(e)
    const results = {
      headers: {},
      sources: '',
      subtitles: ''
    };
    return results;
  }
}

async function string_atob(input) {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  var str = input.replace(/=+$/, '');
  var output = '';
  if (str.length % 4 == 1) {
    throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (var bc = 0, bs = 0, buffer = void 0, i = 0; buffer = str.charAt(i++); ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
    bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
    buffer = chars.indexOf(buffer);
  }
  return output;
}

async function request_get(url, headers = {}) {
  try {
    headers = headers || {};
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return "";
  }
}