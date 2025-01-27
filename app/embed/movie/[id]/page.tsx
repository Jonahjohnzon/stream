"use client"
import Player from '@/app/Player/Player'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [src, setSrc] = useState("")
  const [loading, setLoading] = useState(true)
    const PROXY =async()=>{

      try{
      setLoading(true)
      const info = await fetch(`/api/getmovie?type=movie&id=310131`);
      const m3u8 = await info.json();
      console.log(m3u8)

  const originalUrl = m3u8?.requestUrl;
  if (!originalUrl) {
    console.error("Failed to fetch the original m3u8 URL");
    setLoading(false);
    return;
  }

  // Encode and create the proxy URL
  const proxyBaseUrl = "http://www.whateverorigin.org/get?url=";
  const encodedUrl = encodeURIComponent(originalUrl)
  const proxyUrl = `${proxyBaseUrl}${encodedUrl}`;
  setSrc(originalUrl)
  setLoading(false)
}
catch(err)
{
  setLoading(false)
  console.log(err)
}
    }
    
  useEffect(()=>{
    PROXY()
  },[])
  if (loading)
    return <div>loading</div>

  return (
    <>
        <Player src={src}/>
    </>
  )
}

export default page
