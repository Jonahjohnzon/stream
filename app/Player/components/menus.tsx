import type { ReactElement } from 'react';

import {
  Menu,
  Title,
  Tooltip,
  useCaptionOptions,
  useVideoQualityOptions,
  type MenuPlacement,
  type TooltipPlacement,
} from '@vidstack/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClosedCaptionsIcon,
  RadioButtonIcon,
  RadioButtonSelectedIcon,
  SettingsIcon,
  SettingsMenuIcon 
} from '@vidstack/react/icons';

import { buttonClass, tooltipClass } from './buttons';

export interface SettingsProps {
  placement: MenuPlacement;
  tooltipPlacement: TooltipPlacement;
}

export interface ResProps {
  placement: MenuPlacement;
  tooltipPlacement: TooltipPlacement;
  player:any
}
export const menuClass =
  'animate-out fade-out slide-out-to-bottom-2 scrollbar-none data-[open]:animate-in data-[open]:fade-in data-[open]:slide-in-from-bottom-4 flex h-[var(--menu-height)] max-h-[400px] min-w-[260px] flex-col overflow-y-auto overscroll-y-contain rounded-md border border-white/10 bg-black/95 p-2.5 font-sans text-[12px] sm:text-[15px] font-medium outline-none backdrop-blur-sm transition-[height] duration-300 will-change-[height] data-[resizing]:overflow-hidden';

  export const resClass =
  'animate-out media-controls:block hidden fade-out slide-out-to-bottom-2 scrollbar-none data-[open]:animate-in data-[open]:fade-in data-[open]:slide-in-from-bottom-4 flex h-[var(--menu-height)] max-h-[400px] min-w-[140px] flex-col overflow-y-auto overscroll-y-contain rounded-md border border-white/10 bg-black/95 p-2.5 font-sans text-[12px] sm:text-[15px] font-medium outline-none backdrop-blur-sm transition-[height] z-30 duration-300 will-change-[height] data-[resizing]:overflow-hidden';

export const submenuClass =
  'hidden w-full flex-col items-start justify-center outline-none data-[keyboard]:mt-[3px] data-[open]:inline-block';

export function Settings({ placement, tooltipPlacement }: SettingsProps) {
  return (
    <Menu.Root className="parent">
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Menu.Button className={buttonClass}>
            <SettingsIcon className="h-5 sm:h-8 w-5 sm:w-8 transform transition-transform duration-200 ease-out group-data-[open]:rotate-90" />
          </Menu.Button>
        </Tooltip.Trigger>
      </Tooltip.Root>
      <Menu.Content className={menuClass} placement={placement}>
        <CaptionSubmenu />
      </Menu.Content>
    </Menu.Root>
  );
}


export function VideoQualitySubmenu() {
  const options = useVideoQualityOptions({ auto: true, sort: 'descending' }),
    currentQualityHeight = options.selectedQuality?.height,
    hint =
      options.selectedValue !== 'auto' && currentQualityHeight
        ? `${currentQualityHeight}p`
        : `Auto${currentQualityHeight ? ` (${currentQualityHeight}p)` : ''}`;
  return (
    <Menu.Root className="parent relative ">
      <Menu.Button disabled={options.disabled} className='media-controls:block hidden absolute top-5 right-10 sm:right-16 z-50'>
        <SettingsMenuIcon className=" h-5 sm:h-8 w-5 sm:w-8 transform transition-transform duration-200 ease-out group-data-[open]:rotate-90"/>
      </Menu.Button>
      <Menu.Content className={resClass} placement={"bottom start"}>
        <Menu.RadioGroup value={options.selectedValue}>
          {options.map(({ label, value,  select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

function CaptionSubmenu() {
  const options = useCaptionOptions(),
    hint = options.selectedTrack?.label ?? 'Off';
  return (
    <Menu.Root>
      <SubmenuButton
        label="Captions"
        hint={hint}
        disabled={options.disabled}
        icon={ClosedCaptionsIcon}
      />
      <Menu.Content className={submenuClass}>
        <Menu.RadioGroup className="w-full flex flex-col" value={options.selectedValue}>
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  );
}

export interface RadioProps extends Menu.RadioProps {}

function Radio({ children, ...props }: RadioProps) {
  return (
    <Menu.Radio
      className="ring-media-focus group relative flex w-full cursor-pointer select-none items-center justify-start rounded-sm p-2.5 outline-none data-[hocus]:bg-white/10 data-[focus]:ring-[3px]"
      {...props}
    >
      <RadioButtonIcon className="h-5 w-5 text-white group-data-[checked]:hidden" />
      <RadioButtonSelectedIcon className="text-media-brand hidden text-red-400  h-5 w-5 group-data-[checked]:block" />
      <span className="ml-2">{children}</span>
    </Menu.Radio>
  );
}

export interface SubmenuButtonProps {
  label: string;
  hint: string;
  disabled?: boolean;
  icon: any;
}

function SubmenuButton({ label, hint, icon: Icon, disabled }: SubmenuButtonProps) {
  return (
    <Menu.Button
      className="ring-media-focus parent left-0 z-10 flex w-full cursor-pointer select-none items-center justify-start rounded-sm bg-black/60 p-2.5 outline-none ring-inset data-[open]:sticky data-[open]:-top-2.5 data-[hocus]:bg-white/10 data-[focus]:ring-[3px] aria-disabled:hidden"
      disabled={disabled}
    >
      <ChevronLeftIcon className="parent-data-[open]:block -ml-0.5 mr-1.5 hidden h-[18px] w-[18px]" />
      <div className="contents parent-data-[open]:hidden">
        <Icon className="w-5 h-5" />
      </div>
      <span className="ml-1.5 parent-data-[open]:ml-0">{label}</span>
      <span className="ml-auto text-sm text-white/50">{hint}</span>
      <ChevronRightIcon className="parent-data-[open]:hidden ml-0.5 h-[18px] w-[18px] text-sm text-white/50" />
    </Menu.Button>
  );
}
