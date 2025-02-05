import captionStyles from './captions.module.css';
import styles from './video-layout.module.css';
import { PlayButton, Title, useMediaState } from '@vidstack/react';
import { PauseIcon, PlayIcon } from '@vidstack/react/icons';
import { Captions, Controls, Gesture } from '@vidstack/react';
import * as Buttons from '../buttons';
import * as Menus from '../menus';
import * as Sliders from '../sliders';
import { TimeGroup } from '../time-group';
import { Titles } from '../title';
import { BufferingIndicator } from './buffer';



export function VideoLayout() {
  const isPaused = useMediaState('paused')
  return (
    <>
      <Gestures />
      <Captions
        className={`${captionStyles.captions} media-preview:opacity-0 media-controls:bottom-[85px] media-captions:opacity-100 absolute inset-0 bottom-2 z-10 select-none break-words opacity-0 transition-[opacity,bottom] duration-300`}
      />
      <Controls.Root
        className={`${styles.controls}  absolute inset-0 z-10 flex h-full w-full flex-col bg-gradient-to-t from-black/10 to-transparent   transition-opacity`}
      >
        <Controls.Group>
        <Menus.VideoQualitySubmenu />
        </Controls.Group>
        <div className="flex-1 flex justify-center items-center" >
        {/* {isPaused &&<div className='text-white font-bold  bg-black px-3 rounded-sm py-2 absolute top-5 left-4'>
            <p className=' text-lg'>You're watching</p>
            <Title className=' whitespace-nowrap text-2xl'/>
          </div>} */}
        <Controls.Group>
        <PlayButton className="vds-button cursor-pointer opacity-0 media-can-play:block  media-buffering:opacity-0 hidden media-paused:opacity-100">
          <PlayIcon className="play-icon  hover:scale-110 transition-all duration-300 ease-in-out vds-icon text-white outline-none w-24 md:w-40  " />
        </PlayButton>
        </Controls.Group>
        <BufferingIndicator/>
        </div>
        <Controls.Group className="w-full media-controls:flex hidden items-center px-2">
          <Sliders.Time  />
        </Controls.Group>
        <Controls.Group className="-mt-0.5  w-full items-center px-2 pb-2 media-controls:flex hidden">
          <Buttons.Play tooltipPlacement="top start" />
          <Buttons.Mute tooltipPlacement="top" />
          <Sliders.Volume />
          <TimeGroup />
          <Titles />
          <div className="flex-1" />
          <Buttons.Caption tooltipPlacement="top" />
          <Menus.Settings placement="top end" tooltipPlacement="top" />
          <Buttons.PIP tooltipPlacement="top" />
          <Buttons.Fullscreen tooltipPlacement="top end" />
        </Controls.Group>
      </Controls.Root>
    </>
  );
}

function Gestures() {
  return (
    <>
      <Gesture
        className="absolute inset-0 z-0 block h-full w-full"
        event="pointerup"
        action="toggle:paused"
      />
      <Gesture
        className="absolute inset-0 z-0 block h-full w-full"
        event="dblpointerup"
        action="toggle:fullscreen"
      />
      <Gesture
        className="absolute left-0 top-0 z-10 block h-full w-1/5"
        event="dblpointerup"
        action="seek:-10"
      />
      <Gesture
        className="absolute right-0 top-0 z-10 block h-full w-1/5"
        event="dblpointerup"
        action="seek:10"
      />
    </>
  );
}
