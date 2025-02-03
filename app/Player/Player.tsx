"use client"
import { useRef } from 'react';
import '@vidstack/react/player/styles/base.css';
import {
    MediaPlayer,
    MediaProvider,
    Track,
    type MediaPlayerInstance,
  } from '@vidstack/react';
import { textTracks } from './tracks';
import { VideoLayout } from './components/layouts/video-layout';

interface prop {
    src:string,
    title?:any
}

const Player = ({src, title}:prop) => {
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
        {textTracks.map((track) => (
          <Track  {...track} key={track.src} />
        ))}
      </MediaProvider>
      <VideoLayout thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"/>
        </MediaPlayer>
    </div>
  )
}

export default Player