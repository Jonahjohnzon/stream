"use client"
import { useRef } from 'react';
import '@vidstack/react/player/styles/base.css';
import { useSnapshot } from 'valtio';
import {
    MediaPlayer,
    MediaProvider,
    Poster,
    Track,
    type MediaPlayerInstance,
  } from '@vidstack/react';
import { VideoLayout } from './components/layouts/video-layout';
import { store } from '../store';

interface prop {
    src?:string,
    title?:any,
    Srt?:any
}

const Player = ({src,title,Srt}:prop) => {
    let player = useRef<MediaPlayerInstance>(null);
  return (
    <div  className=' text-white  w-screen h-screen overflow-hidden flex items-center justify-center   scrollbar-none'>
        <MediaPlayer 
        title={title}
        key={src}
        aspectRatio="16/9"
        className=' scrollbar-none  w-screen h-screen bg-black'
         src={src}
         load="eager"
         crossOrigin=""
         playsInline
         storage={src}
         ref={player}
       >
        <MediaProvider className='scrollbar-none'>
           {Object.keys(Srt).length > 0&&<Track
           src={`${Srt.subUrl}`}
          kind="subtitles"
          label={Srt.display}
          lang={Srt.language}
          type="srt"
          default
           />}
     
      </MediaProvider>
      <VideoLayout />
        </MediaPlayer>
    </div>
  )
}

export default Player