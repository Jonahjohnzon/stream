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
import { FaPlay } from "react-icons/fa";


export function VideoLayout() {
  const isPaused = useMediaState('paused')
  return (
    <>
      <Gestures />

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
        <PlayButton className="vds-button    absolute  inset-0 z-50  cursor-pointer opacity-0 media-can-play:flex justify-center items-center media-seeking:hidden media-waiting:hidden  media-buffering:opacity-0 hidden media-paused:opacity-100">
          <FaPlay className="  transition-all duration-300 ease-in-out vds-icon text-white outline-none scale-[300%] md:scale-[600%]  " />
        </PlayButton>
        <BufferingIndicator/>
        <Captions
        className={` lg:text-xl md:text-2xl font-medium px-2 bg-black max-w-[80%] sm:max-w-96 text-center  bg-opacity-65 bottom-[40px] leading-5 lg:leading-10 tracking-wider   media-preview:opacity-0 media-controls:bottom-[85px] media-captions:opacity-100 absolute   z-10 select-none break-words opacity-0 transition-[opacity,bottom] duration-300`}
      />
        </div>

        <Controls.Group className="w-full media-controls:flex hidden items-center px-2">
          <Sliders.Time  />
        </Controls.Group>
        <Controls.Group className="-mt-0.5 z-40  w-full items-center px-2 pb-2 media-controls:flex hidden">
          <div className='sm:flex w-full items-center hidden'>
            <div className='mr-2'>
          <Buttons.Play tooltipPlacement="top start" />
          </div>
          <Buttons.Mute tooltipPlacement="top" />
          <Sliders.Volume />
          <TimeGroup />
          <Titles />
          </div>
          <div className="sm:flex-1" />
          <div>
          <Menus.Settings placement="top end" tooltipPlacement="top" />
          </div>
          <div className="flex-1 sm:flex" />
          <div className='ml-4'>
          <Menus.Server placement="top end" tooltipPlacement="top"/>
          </div>
          <div className=' sm:mx-4'>
          <Buttons.PIP tooltipPlacement="top" />
          </div>
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
