"use client"
import Player from '@/app/Player/Player'
import React, { useEffect, useState } from 'react'

const Body = ({id}:any) => {
  const [src, setSrc] = useState("")
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [error, setError] = useState(false)

  const Tmdb =async({tmdb_id}:any)=>{
    const url = `https://api.themoviedb.org/3/movie/${tmdb_id}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `${process.env.NEXT_PUBLIC_BEARER}`,
        "Content-Type": "application/json",
      },
    });
    const tmdbData = await response.json()
    const title = tmdbData.title || tmdbData.name || "Unknown Title";
    return title
  }
  const PROXY =async()=>{
      try{
      setLoading(true)
      const info = await fetch(`/api/getmovie?type=movie&id=${id}&server=1`);
      const m3u8 = await info.json();
      setTitle(m3u8.title)
  const originalUrl = m3u8?.requestUrl;
  if (!originalUrl) {
    console.log("Failed to fetch the original m3u8 URL");
    setLoading(false);
    setError(true)
    return;
  }

//   // Encode and create the proxy URL
//   const proxyBaseUrl = "http://www.whateverorigin.org/get?url=";
//   const encodedUrl = encodeURIComponent(originalUrl)
//   const proxyUrl = `${proxyBaseUrl}${encodedUrl}`;
  setSrc(originalUrl)
  setLoading(false)
}
catch(err)
{
  setLoading(false)
  setError(true)
  console.log(err)
}
    }
    
  useEffect(()=>{
    PROXY()
  },[])
  if (loading)
    return <div className=' fixed z-50 w-screen h-screen bg-black flex justify-center items-center'>
          <div className=' border-2 w-9 h-9 rounded-full border-white border-t-0 animate-spin'></div>
    </div>

  if(error)
  {
    return <div className=' fixed z-50 w-screen h-screen bg-black flex justify-center items-center'>
    <p className=' font-bold text-lg text-white'>Media Not Found</p>
    </div>
  }
  return (
    <>
        <Player src={src} title={title}/>
    </>
  )
}

export default Body
