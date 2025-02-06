import { Spinner } from '@vidstack/react';

export function BufferingIndicator() {
  return (
    <div className="pointer-events-none absolute  inset-0 z-50 flex h-full w-full items-center justify-center">
      <Spinner.Root
        className=" media-can-load:opacity-100 media-can-load:animate-spin media-paused:hidden media-playing:hidden  border-2 w-16 h-16 rounded-full border-white border-t-0   opacity-0 media-waiting:opacity-100 media-waiting:animate-spin media-seeking:animate-spin media-seeking:opacity-100 transition-opacity duration-200 ease-linear media-buffering:animate-spin media-buffering:opacity-100 "
        size={84}
      >
        
      </Spinner.Root>
    </div>
  );
}