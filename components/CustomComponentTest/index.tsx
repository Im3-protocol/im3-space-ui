import { ChatIcon, ChatToggle, ControlBar, ControlBarProps, DisconnectButton, GearIcon, LeaveIcon, MediaDeviceMenu, TrackToggle, useEnsureRoom, useLocalParticipantPermissions, useMaybeLayoutContext, usePersistentUserChoices } from '@livekit/components-react'
import { Room, RoomEvent, Track } from 'livekit-client';
import React from 'react'
import {useMediaQuery} from '@livekit/components-react/src/hooks/internal/useMediaQuery'
import {SettingsMenuToggle, SettingsMenuToggleProps} from '@livekit/components-react/src/components/controls/SettingsMenuToggle'
import { mergeProps as mergePropsReactAria } from '@livekit/components-react/src/mergeProps';
import { useSettingsToggle } from '@livekit/components-react/src/hooks/useSettingsToggle';
import { prefixClass } from '../styles-interface';
import loglevel from 'loglevel';
import { Subject, map, Observable, startWith, finalize, filter, concat } from '../../node_modules/.pnpm/rxjs@7.8.1/node_modules/rxjs/src/index';

const log = loglevel.getLogger('lk-components-js');

export function setupStartAudio() {
  const handleStartAudioPlayback = async (room: Room) => {
    log.info('Start Audio for room: ', room);
    await room.startAudio();
  };
  const className: string = prefixClass('start-audio-button');
  return { className, roomAudioPlaybackAllowedObservable, handleStartAudioPlayback };
}


export interface UseStartVideoProps {
  room?: Room;
  props: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export function observeRoomEvents(room: Room, ...events: RoomEvent[]): Observable<Room> {
  const observable = new Observable<Room>((subscribe) => {
    const onRoomUpdate = () => {
      subscribe.next(room);
    };

    events.forEach((evt) => {
      room.on(evt, onRoomUpdate);
    });

    const unsubscribe = () => {
      events.forEach((evt) => {
        room.off(evt, onRoomUpdate);
      });
    };
    return unsubscribe;
  }).pipe(startWith(room));

  return observable;
}

 function roomAudioPlaybackAllowedObservable(room: Room) {
  const observable = observeRoomEvents(room, RoomEvent.AudioPlaybackStatusChanged).pipe(
    map((room) => {
      return { canPlayAudio: room.canPlaybackAudio };
    }),
  );
  return observable;
}



 function useStartVideo({ room, props }: UseStartVideoProps) {
  const roomEnsured = useEnsureRoom(room);
  const { className, roomVideoPlaybackAllowedObservable, handleStartVideoPlayback } = React.useMemo(
    () => setupStartVideo(),
    [],
  );
  const observable = React.useMemo(
    () => roomVideoPlaybackAllowedObservable(roomEnsured),
    [roomEnsured, roomVideoPlaybackAllowedObservable],
  );
  const { canPlayVideo } = useObservableState(observable, {
    canPlayVideo: roomEnsured.canPlaybackVideo,
  });

export function setupStartAudio() {
  const handleStartAudioPlayback = async (room: Room) => {
    log.info('Start Audio for room: ', room);
    await room.startAudio();
  };
  const className: string = prefixClass('start-audio-button');
  return { className, roomAudioPlaybackAllowedObservable, handleStartAudioPlayback };
}

export function isProp<U extends HTMLElement, T extends React.HTMLAttributes<U>>(
  prop: T | undefined,
): prop is T {
  return prop !== undefined;
}

export interface AllowMediaPlaybackProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}
const log = loglevel.getLogger('lk-components-js');


function Custom({
  variation,
  controls,
  children,
  saveUserChoices = true,
  ...props
}: ControlBarProps) {

  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const layoutContext = useMaybeLayoutContext();
  function useMediaQuery(query: string): boolean {
    const getMatches = (query: string): boolean => {
      // Prevents SSR issues
      if (typeof window !== 'undefined') {
        return window.matchMedia(query).matches;
      }
      return false;
    };
  
    const [matches, setMatches] = React.useState<boolean>(getMatches(query));
  
    function handleChange() {
      setMatches(getMatches(query));
    }
  
    React.useEffect(() => {
      const matchMedia = window.matchMedia(query);
  
      // Triggered at the first client-side load and if query changes
      handleChange();
  
      // Listen matchMedia
      if (matchMedia.addListener) {
        matchMedia.addListener(handleChange);
      } else {
        matchMedia.addEventListener('change', handleChange);
      }
  
      return () => {
        if (matchMedia.removeListener) {
          matchMedia.removeListener(handleChange);
        } else {
          matchMedia.removeEventListener('change', handleChange);
        }
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);
  
    return matches;
  }

 const RoomContext = React.createContext<Room | undefined>(undefined);
 function useRoomContext() {
    const ctx = React.useContext(RoomContext);
    if (!ctx) {
      throw Error('tried to access room context outside of livekit room component');
    }
    return ctx;
  }
  
   interface UseStartAudioProps {
    room?: Room;
    props: React.ButtonHTMLAttributes<HTMLButtonElement>;
  }

  export function useObservableState<T>(
    observable: Observable<T> | undefined,
    startWith: T,
    resetWhenObservableChanges = true,
  ) {
    const [state, setState] = React.useState<T>(startWith);
    React.useEffect(() => {
      if (resetWhenObservableChanges) {
        setState(startWith);
      }
      // observable state doesn't run in SSR
      if (typeof window === 'undefined' || !observable) return;
      const subscription = observable.subscribe(setState);
      return () => subscription.unsubscribe();
    }, [observable, resetWhenObservableChanges]);
    return state;
  }

  
   function useStartAudio({ room, props }: UseStartAudioProps) {
    const roomEnsured = useEnsureRoom(room);
    const { className, roomAudioPlaybackAllowedObservable, handleStartAudioPlayback } = React.useMemo(
      () => setupStartAudio(),
      [],
    );
    const observable = React.useMemo(
      () => roomAudioPlaybackAllowedObservable(roomEnsured),
      [roomEnsured, roomAudioPlaybackAllowedObservable],
    );
    const { canPlayAudio } = useObservableState(observable, {
      canPlayAudio: roomEnsured.canPlaybackAudio,
    });
  
    const mergedProps = React.useMemo(
      () =>
        mergeProps(props, {
          className,
          onClick: () => {
            handleStartAudioPlayback(roomEnsured);
          },
          style: { display: canPlayAudio ? 'none' : 'block' },
        }),
      [props, className, canPlayAudio, handleStartAudioPlayback, roomEnsured],
    );
  
    return { mergedProps, canPlayAudio };
  }

  const StartMediaButton = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  AllowMediaPlaybackProps
>(function StartMediaButton({ label, ...props }: AllowMediaPlaybackProps, ref) {
  const room = useRoomContext();
  const { mergedProps: audioProps, canPlayAudio } = useStartAudio({ room, props });
  const { mergedProps, canPlayVideo } = useStartVideo({ room, props: audioProps });
  const { style, ...restProps } = mergedProps;
  style.display = canPlayAudio && canPlayVideo ? 'none' : 'block';

  return (
    <button ref={ref} style={style} {...restProps}>
      {label ?? `Start ${!canPlayAudio ? 'Audio' : 'Video'}`}
    </button>
  );
});


  function mergeProps<
  U extends HTMLElement,
  T extends Array<React.HTMLAttributes<U> | undefined>,
>(...props: T) {
  return mergePropsReactAria(...props.filter(isProp));
}


  function supportsScreenSharing(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      navigator.mediaDevices &&
      !!navigator.mediaDevices.getDisplayMedia
    );
  }

  const SettingsMenuToggle = /* @__PURE__ */ React.forwardRef<
  HTMLButtonElement,
  SettingsMenuToggleProps
>(function SettingsMenuToggle(props: SettingsMenuToggleProps, ref) {
  const { mergedProps } = useSettingsToggle({ props });

  return (
    <button ref={ref} {...mergedProps}>
      {props.children}
    </button>
  );
});

  React.useEffect(() => {
    if (layoutContext?.widget.state?.showChat !== undefined) {
      setIsChatOpen(layoutContext?.widget.state?.showChat);
    }
  }, [layoutContext?.widget.state?.showChat]);
  const isTooLittleSpace = useMediaQuery(`(max-width: ${isChatOpen ? 1000 : 760}px)`);

  const defaultVariation = isTooLittleSpace ? 'minimal' : 'verbose';
  variation ??= defaultVariation;

  const visibleControls = { leave: true, ...controls };

  const localPermissions = useLocalParticipantPermissions();

  if (!localPermissions) {
    visibleControls.camera = false;
    visibleControls.chat = false;
    visibleControls.microphone = false;
    visibleControls.screenShare = false;
  } else {
    visibleControls.camera ??= false;
    visibleControls.microphone ??= localPermissions.canPublish;
    visibleControls.screenShare ??= localPermissions.canPublish;
    visibleControls.chat ??= localPermissions.canPublishData && controls?.chat;
  }

  const showIcon = React.useMemo(
    () => variation === 'minimal' || variation === 'verbose',
    [variation],
  );
  const showText = React.useMemo(
    () => variation === 'textOnly' || variation === 'verbose',
    [variation],
  );

  const browserSupportsScreenSharing = supportsScreenSharing();

  const [isScreenShareEnabled, setIsScreenShareEnabled] = React.useState(false);

  const onScreenShareChange = React.useCallback(
    (enabled: boolean) => {
      setIsScreenShareEnabled(enabled);
    },
    [setIsScreenShareEnabled],
  );

  const htmlProps = mergeProps({ className: 'lk-control-bar' }, props);

  const {
    saveAudioInputEnabled,
    saveVideoInputEnabled,
    saveAudioInputDeviceId,
    saveVideoInputDeviceId,
  } = usePersistentUserChoices({ preventSave: !saveUserChoices });

  const microphoneOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveAudioInputEnabled(enabled) : null,
    [saveAudioInputEnabled],
  );

  const cameraOnChange = React.useCallback(
    (enabled: boolean, isUserInitiated: boolean) =>
      isUserInitiated ? saveVideoInputEnabled(enabled) : null,
    [saveVideoInputEnabled],
  );

  return (
    <div {...htmlProps}>
      {visibleControls.microphone && (
        <div className="lk-button-group">
          <TrackToggle
            source={Track.Source.Microphone}
            showIcon={showIcon}
            onChange={microphoneOnChange}
          >
            {showText && 'Microphone'}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="audioinput"
              onActiveDeviceChange={(_kind, deviceId) => saveAudioInputDeviceId(deviceId ?? '')}
            />
          </div>
        </div>
      )}
      {visibleControls.camera && (
        <div className="lk-button-group">
          <TrackToggle source={Track.Source.Camera} showIcon={showIcon} onChange={cameraOnChange}>
            {showText && 'Camera'}
          </TrackToggle>
          <div className="lk-button-group-menu">
            <MediaDeviceMenu
              kind="videoinput"
              onActiveDeviceChange={(_kind, deviceId) => saveVideoInputDeviceId(deviceId ?? '')}
            />
          </div>
        </div>
      )}
      {visibleControls.screenShare && browserSupportsScreenSharing && (
        <TrackToggle
          source={Track.Source.ScreenShare}
          captureOptions={{ audio: true, selfBrowserSurface: 'include' }}
          showIcon={showIcon}
          onChange={onScreenShareChange}
        >
          {showText && (isScreenShareEnabled ? 'Stop screen share' : 'Share screen')}
        </TrackToggle>
      )}
      {visibleControls.chat && (
        <ChatToggle>
          {showIcon && <ChatIcon />}
          {showText && 'Chat'}
        </ChatToggle>
      )}
      {visibleControls.settings && (
        <SettingsMenuToggle>
          {showIcon && <GearIcon />}
          {showText && 'Settings'}
        </SettingsMenuToggle>
      )}
      {visibleControls.leave && (
        <DisconnectButton >
          {showIcon && <LeaveIcon />}
          {showText && 'Leave'}
        </DisconnectButton>
      )}
      <StartMediaButton />
    </div>
  );
}

export default Custom