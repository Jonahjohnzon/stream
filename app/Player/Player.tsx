"use client"
import { useRef } from 'react';
import '@vidstack/react/player/styles/base.css';
import { useSnapshot } from 'valtio';
import {
    MediaPlayer,
    MediaProvider,
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
        {Srt.map((track:any,i:any)=>{
          return(
           <Track
           key={i}
           src={track.url}
          kind="subtitles"
          label={track.lang}
          lang="en-US"
          default
           />
          )
        })}
      </MediaProvider>
      <VideoLayout thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"/>
        </MediaPlayer>
    </div>
  )
}

export default Player