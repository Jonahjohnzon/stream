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
import { ResLayout } from './components/layouts/resControl';

interface prop {
    src:string
}

const Player = ({src}:prop) => {
    let player = useRef<MediaPlayerInstance>(null);
    useEffect(() => {
      // Subscribe to state updates.
      return player.current!.subscribe(({ paused, viewType }) => {
        // console.log('is paused?', '->', state.paused);
        // console.log('is audio view?', '->', state.viewType === 'audio');
      });
    }, []);
  
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
        title="Sprite Fight"
        className=' scrollbar-none  w-screen h-screen bg-black'
         src={src}
         crossOrigin=""
         playsInline
         onProviderChange={onProviderChange}
         onCanPlay={onCanPlay}
         ref={player}
       >
        <ResLayout player={player}/>
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