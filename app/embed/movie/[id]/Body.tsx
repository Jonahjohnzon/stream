"use client"
import Player from '@/app/Player/Player'
import React, { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'
import { store } from '@/app/store'
const Body = ({id}:any) => {
  const [src, setSrc] = useState("")
  const server = useSnapshot(store).server
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [error, setError] = useState(false)
  const [Srt, setSrt] = useState([])
  const PROXY =async()=>{
      try{
      setLoading(true)
      const info = await fetch(`/api/getmovie?type=movie&id=${id}&server=1`);
      const m3u8 = await info.json();
      // const data = await fetch(`https://sub.wyzie.ru/search?id=${id}&format=srt`)
      // const vttContent =  await data.json();
      // // console.log(vttContent)
      // // setSrt(vttContent)
      console.log(m3u8)
      setTitle(m3u8.title)
  const originalUrl = m3u8?.pageUrl?.sources;
  if (!originalUrl) {
    console.log("Failed to fetch the original m3u8 URL");
    setLoading(false);
    setError(true)
    return;
  }
  setSrt(m3u8?.pageUrl?.subtitles)
  store.server = originalUrl[0]?.url

//   // Encode and create the proxy URL
//   const proxyBaseUrl = "http://www.whateverorigin.org/get?url=";
//   const encodedUrl = encodeURIComponent(originalUrl)
//   const proxyUrl = `${proxyBaseUrl}${encodedUrl}`;
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
        <Player  title={title} Srt={Srt}/>
    </>
  )
}

export default Body
