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

const Player = ({title,Srt}:prop) => {
    const server = useSnapshot(store).server
    let player = useRef<MediaPlayerInstance>(null);
    
  return (
    <div  className=' text-white  w-screen h-screen overflow-hidden flex items-center justify-center   scrollbar-none'>
        <MediaPlayer 
        title={title}
        key={server}
        aspectRatio="16/9"
        className=' scrollbar-none  w-screen h-screen bg-black'
         src={server}
         load="eager"
         crossOrigin=""
         playsInline
         storage={server}
         ref={player}
       >
        <MediaProvider className='scrollbar-none'>
        {Srt.map((track:any,i:any)=>{
          console.log(i)
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