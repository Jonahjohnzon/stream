import captionStyles from './captions.module.css';
import styles from './video-layout.module.css';

import { Captions, Controls, Gesture } from '@vidstack/react';

import * as Buttons from '../buttons';
import * as Menus from '../menus';




export function ResLayout({player}:any) {
  return (
    <>

        <div className="flex-1 media-preview:opacity-0  media-captions:opacity-100" />
        <Controls.Group className="mt-1.5   flex w-full items-center px-5 pt-2">
          <div className="flex-1" />
          <Menus.VideoQualitySubmenu />
        </Controls.Group>
    </>
  );
}



