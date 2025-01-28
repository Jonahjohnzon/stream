"use client"
import { useEffect, useRef } from 'react';
import '@vidstack/react/player/styles/base.css';
import {
    isHLSProvider,
    MediaPlayer,
    MediaProvider,
    useMediaStore,
    Poster,
    Track,
    type MediaCanPlayDetail,
    type MediaCanPlayEvent,
    type MediaPlayerInstance,
    type MediaProviderAdapter,
    type MediaProviderChangeEvent,
  } from '@vidstack/react';
import { textTracks } from './tracks';
import { VideoLayout } from './components/layouts/video-layout';

interface prop {
    src:string,
    title?:any
}

const Player = ({src, title}:prop) => {
    let player = useRef<MediaPlayerInstance>(null);

  
    function onProviderChange(
      provider: MediaProviderAdapter | null,
      nativeEvent: MediaProviderChangeEvent,
    ) {
      // We can configure provider's here.
      if (isHLSProvider(provider)) {
        provider.config = {};
      }
    }
  
    // We can listen for the `can-play` event to be notified when the player is ready.
    function onCanPlay(detail: MediaCanPlayDetail, nativeEvent: MediaCanPlayEvent) {
      // ...
    }
  
  return (
    <div  className='  w-screen h-screen overflow-hidden flex items-center justify-center   scrollbar-none'>
        <MediaPlayer 
        title={title}
        className=' scrollbar-none  w-screen h-screen bg-black'
         src={src}
         crossOrigin=""
         playsInline
         onProviderChange={onProviderChange}
         onCanPlay={onCanPlay}
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