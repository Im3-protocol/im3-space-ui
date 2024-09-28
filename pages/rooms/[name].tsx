  import {
    LiveKitRoom,
    VideoConference,
    formatChatMessageLinks,
    LocalUserChoices,
    PreJoin,
    ControlBar,
    useCreateLayoutContext,
    LayoutContextProvider,
    Chat,
    ChatToggle,
    ChatIcon,
    GearIcon,
    ChatCloseIcon,
  } from '@livekit/components-react';

  import {
    DeviceUnsupportedError,
    ExternalE2EEKeyProvider,
    Room,
    RoomConnectOptions,
    RoomOptions,
    VideoCodec,
    VideoPresets,
    setLogLevel,
  } from 'livekit-client';

  import type { NextPage } from 'next';
  import Head from 'next/head';
  import { useRouter } from 'next/router';
  import { useEffect, useMemo, useState } from 'react';
  import { DebugMode } from '../../lib/Debug';
  import { decodePassphrase, useServerUrl } from '../../lib/client-utils';
  import { SettingsMenu } from '../../lib/SettingsMenu';
  import useWagmi from '../../hooks/useWagmi';
  import { useConnectModal } from '@rainbow-me/rainbowkit';
  import { useSignMessage } from 'wagmi';
  import { userAuthApi } from '../api/userAuth';
  import styles from '../../styles/Home.module.css';
  import checkBoxStyles from '../../styles/checkBox.module.css';
  import ParticipantsButton from '../../components/ParticipentsButton';
  import useGetIdentity from '../../hooks/useGetIdentity';
  import React from 'react';
  import CopyButton from '../../components/CopyButton';
  import RecordTap from '../../components/RecordTab';
  import { axiosInstance } from '../api/base';
  import useGetConfigData from '../../hooks/useGetConfigData';
  import SlugInfoPreJoin from '../../components/SlugInfoPrejoin';
  import { useGetAdmins } from '../../hooks/useGetAdmins';
  import ForbiddenCard from '../../components/ForbidenCard';

  const Home: NextPage = () => {
    const router = useRouter();
    const { name: roomName } = router.query;
    const [configSlugData, setConfigData] = useState(null);

    useEffect(() => {
      if (roomName) {
        axiosInstance
          .post(`/api/v1/rooms/get-room-config/${roomName}`)
          .then((response) => {
            setConfigData(response.data);
            console.log("This is slug post res: ", configSlugData );
          })
          .catch((error) => {
            console.error('Error fetching config:', error);
          });
      }
    }, [roomName]);
    const [preJoinChoices, setPreJoinChoices] = React.useState<LocalUserChoices | undefined>(
      undefined,
    );

    const [roomValues, setRoomValues] = React.useState<LocalUserChoices | null>();
    const [joinAsGuestText, setJoinAsGuestText] = React.useState('Join as Guest');

    const { openConnectModal } = useConnectModal();

    const { account } = useWagmi();

    const zeroAddress = '0x0000000000000000000000000000000000000000';

    const [token, setToken] = React.useState('');

    const [isGuest, setIsGuest] = React.useState(false);

    const { data: signMessageData, signMessage, isLoading } = useSignMessage();
    const { admins } = useGetAdmins(roomName);
    const [authError, setAuthError] = useState(null)

    const preJoinDefaults = React.useMemo(() => {
      return {
        username: '',
        videoEnabled: true,
        audioEnabled: true,
      };
    }, []);

    const handleAuthApi = async (userName: string) => {
      if (signMessageData && roomName && !Array.isArray(roomName) && account) {
        try {
          const res = await userAuthApi(signMessageData, roomName, userName, account, account);
          console.log(token);
          setToken(res);
          return true;
        } catch (e) {
          setAuthError(e);
          console.log(e);
          return false;
        }
      }
    };

    const handleAuthApiGuest = async (userName: string) => {
      if (roomName && !Array.isArray(roomName)) {
        try {
          const res = await userAuthApi('', roomName, userName, zeroAddress, zeroAddress);
          console.log(res);
          setToken(res);
          return true;
        } catch (e) {
          if (e.response) {
            console.log(e.response);
            throw new Error(e.response.data.message || 'Error occurred');
          } else {
            throw new Error('Error occurred during the API request');
          }
          return false;
        }
      }
    };

    const truncateAddress = (address: string, size = 4) => {
      return `${address.substring(0, size + 2)}...${address.substring(address.length - size)}`;
    };

    const handleSignMessage = () => {
      if (account) {
        signMessage({
          message: 'Please sign this message to verify connecting your wallet',
        });
      }
    };

    const handleConnectWallet = async () => {
      openConnectModal!();
    };

    const handleSetPreJonChoices = async () => {
      if (roomValues) {
        const res = await handleAuthApi(roomValues.username);
        console.log(res);
        if (!res) return;
        setPreJoinChoices(roomValues);
      }
    };

    React.useEffect(() => {
      if (account && !signMessageData && roomValues) handleSignMessage();

      if (signMessageData && roomValues) handleSetPreJonChoices();
    }, [account, signMessageData]);

    const handlePreJoinSubmit = React.useCallback(
      async (values: LocalUserChoices) => {
        setRoomValues(values);
        if (isGuest) {
          setJoinAsGuestText('Joining as Guest ...');
          const res = await handleAuthApiGuest(values.username);
          if (!res) return;
          setPreJoinChoices(values);
        } else {
          if (!account) handleConnectWallet();
          if (account && !signMessageData) handleSignMessage();
        }
      },
      [isGuest],
    );

    const onPreJoinError = React.useCallback((e: any) => {
      console.error(e);
      console.log("This user is not in the whiteList");
    }, []);
    const identity = useGetIdentity(token);

    const onLeave = async () => {
      const isAdmin = admins.some((admin) => admin.identity.toLowerCase() === identity.toLowerCase());
      if (isAdmin && !isGuest) {
        try {
          await axiosInstance.delete(`/api/v1/admin/remove-admin/${identity}`);
        } catch (error) {
          console.log(error);
        }
      }
      router.push('/');
    };

    const joinModeHandler = () => {
      setIsGuest((prevChecked) => !prevChecked);
      console.log(isGuest);
    };
    
    const configData = useGetConfigData(roomName);
    const isRoomPrivate = configData?.privateRoom;
    return (
      <>
        <Head>
          <title>IM3 Space</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main data-lk-theme="default" className={styles.bg2}>
          {/* <div
            style={{
              display: 'flex',
              justifyContent: 'end',
              padding: '30px',
              position: 'absolute',
              zIndex: '100000',
              top: 0,
              right: 0,
            }}
          >
            {isGuest ? 'Guest' : account ? truncateAddress(account) : ''}
          </div> */}

          {roomName && !Array.isArray(roomName) && preJoinChoices ? (
            <ActiveRoom
              roomName={roomName}
              userChoices={preJoinChoices}
              onLeave={onLeave}
              token={token}
            ></ActiveRoom>
          ) : (
            <div
              className="grid-cols-2 md:place-items-center overflow-auto  gap-2 md:gap-0 md:py-0 py-2 px-2 md:px-0"
              style={{
                display: 'grid',
                // placeItems: 'center',
                height: 'inherit',
                width: '100%',
              }}
            >
              <SlugInfoPreJoin roomName={roomName} />

              <div
                className={`${styles.tabContainer} !place-self-center !col-span-full md:!col-span-1  preJoin-wrapper `}
              >
                {
                  !authError? (
                    !isGuest ? (
                      <PreJoin
                        onError={onPreJoinError}
                        defaults={preJoinDefaults}
                        joinLabel={
                          authError 
                          ? 'Your Not in the List sorry!':
                          !account && !isLoading
                            ? 'Connect wallet'
                            : account && isLoading
                            ? 'Signing Message'
                            : account && !isLoading && !signMessageData
                            ? 'Sign message to Join Room'
                            : 'Joining Room ...'
                        }
                        onSubmit={handlePreJoinSubmit}
                      ></PreJoin>
                    ) : (
                      <PreJoin
                        onError={onPreJoinError}
                        defaults={preJoinDefaults}
                        joinLabel={joinAsGuestText}
                        onSubmit={handlePreJoinSubmit}
                      ></PreJoin>
                    )
                  ) : (
                    <ForbiddenCard />
                  )
                }

                {!isRoomPrivate ? (
                  <div className={checkBoxStyles.guest}>
                    {!isGuest && <p className={checkBoxStyles.subtext}>Don't have a wallet?</p>}
                    <button onClick={joinModeHandler} className={checkBoxStyles.btn}>
                      {isGuest ? 'Have a wallet?' : 'Join as a Guest'}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </main>
      </>
    );
  };

  export default Home;

  type ActiveRoomProps = {
    userChoices: LocalUserChoices;
    roomName: string;
    region?: string;
    onLeave?: () => void;
    token: string;
  };
  const ActiveRoom = ({ roomName, userChoices, onLeave, token }: ActiveRoomProps) => {
    const tokenOptions = React.useMemo(() => {
      return {
        userInfo: {
          identity: userChoices.username,
          name: userChoices.username,
        },
      };
    }, [userChoices.username]);
    // const token = useToken(process.env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT, roomName, tokenOptions);

    const router = useRouter();
    const { region, hq, codec } = router.query;

    const e2eePassphrase =
      typeof window !== 'undefined' && decodePassphrase(location.hash.substring(1));

    const liveKitUrl = useServerUrl(region as string | undefined);

    const worker =
      typeof window !== 'undefined' &&
      e2eePassphrase &&
      new Worker(new URL('livekit-client/e2ee-worker', import.meta.url));

    const e2eeEnabled = !!(e2eePassphrase && worker);
    const keyProvider = new ExternalE2EEKeyProvider();
    const roomOptions = React.useMemo((): RoomOptions => {
      let videoCodec: VideoCodec | undefined = (
        Array.isArray(codec) ? codec[0] : codec ?? 'vp9'
      ) as VideoCodec;
      if (e2eeEnabled && (videoCodec === 'av1' || videoCodec === 'vp9')) {
        videoCodec = undefined;
      }
      return {
        videoCaptureDefaults: {
          deviceId: userChoices.videoDeviceId ?? undefined,
          resolution: hq === 'true' ? VideoPresets.h2160 : VideoPresets.h720,
        },
        publishDefaults: {
          dtx: false,
          videoSimulcastLayers:
            hq === 'true'
              ? [VideoPresets.h1080, VideoPresets.h720]
              : [VideoPresets.h540, VideoPresets.h216],
          red: !e2eeEnabled,
          videoCodec,
        },
        audioCaptureDefaults: {
          deviceId: userChoices.audioDeviceId ?? undefined,
        },
        adaptiveStream: { pixelDensity: 'screen' },
        dynacast: true,
        e2ee: e2eeEnabled
          ? {
              keyProvider,
              worker,
            }
          : undefined,
      };
      // @ts-ignore
      setLogLevel('debug', 'lk-e2ee');
    }, [userChoices, hq, codec]);

    const room = React.useMemo(() => new Room(roomOptions), []);

    if (e2eeEnabled) {
      keyProvider.setKey(decodePassphrase(e2eePassphrase));
      room.setE2EEEnabled(true).catch((e) => {
        if (e instanceof DeviceUnsupportedError) {
          alert(
            `You're trying to join an encrypted meeting, but your browser does not support it. Please update it to the latest version and try again.`,
          );
          console.error(e);
        }
      });
    }
    const connectOptions = React.useMemo((): RoomConnectOptions => {
      return {
        autoSubscribe: true,
      };
    }, []);
    const identity = useGetIdentity(token);
    localStorage.setItem('identity', identity);
    console.log(identity);

    const layoutContext = useCreateLayoutContext();

    const [chatOpen, setChatOpen] = React.useState<boolean>(false);
    const [settingOpen, setSettingOpen] = React.useState<boolean>(false);
    const [tap, setTap] = React.useState<string>('participants');

    const renderChat = React.useMemo(() => {
      console.log('chat state', chatOpen);
      return (
        <Chat
          onClick={(e) => {
            console.log(e, e.target.namespaceURI);
            if (
              (e.target.localName == 'path' || e.target.localName == 'svg') &&
              e.target.namespaceURI == 'http://www.w3.org/2000/svg'
            ) {
              setChatOpen(false);
              console.log(e.target.localName, e.target.namespaceURI);
            } else if (e.target.className == 'lk-close-button lk-button lk-chat-toggle') {
              setChatOpen(false);
              console.log('it is button');
            }
          }}
          style={{ display: `${chatOpen ? 'grid' : 'none'}` }}
          messageFormatter={formatChatMessageLinks}
          // messageEncoder={encode}
          // messageDecoder={decode}
        />
      );
    }, [chatOpen]);

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      console.log('width', width);
      return () => window.removeEventListener('resize', handleResize);
    }, [window.innerWidth]);

    const CustomSetting = React.useMemo(() => {
      return (
        <div className="lk-chat  !items-start">
          <div className="lk-chat-header">
            Settings
            <button
              onClick={() => {
                setSettingOpen(false);
              }}
              className="lk-close-button lk-button lk-chat-toggle"
            >
              <ChatCloseIcon />
            </button>
          </div>
          <section className={`flex flex-col gap-4 py-2.5`}>
            {/* <ParticipantsComponent roomName={roomName} />
            <div className="border-t-2 pt-2 flex justify-center w-full border-[var(--lk-border-color)]">
              <button className="lk-button !w-full !mx-2.5">
                <span>Start Recording</span>
              </button>
            </div> */}
            <form action="" className="flex items-center  px-2.5" id="groupTap">
              <label
                onClick={(e) => {
                  e.preventDefault();
                  console.log(e.target.id);
                  setTap(e.target.id.toLowerCase() ?? e.target.innerHTML.toLowerCase());
                }}
                id="Participants"
                htmlFor="participants"
                className="!w-1/2 has-[:checked]:!bg-[var(--lk-border-color)] !rounded-e-none !text-center lk-button"
              >
                <p id="Participants">Participants</p>
                <input
                  type="radio"
                  className="hidden"
                  checked={tap == 'participants'}
                  name="groupTap"
                  id="participants"
                />
              </label>
              <label
                onClick={(e) => {
                  e.preventDefault();
                  console.log(e.target.id.toLowerCase());
                  setTap(e.target.id.toLowerCase() ?? e.target.innerHTML.toLowerCase());
                }}
                id="record"
                htmlFor="record"
                className="!w-1/2  has-[:checked]:!bg-[var(--lk-border-color)] !rounded-s-none !text-center lk-button"
              >
                <p id="record">Record</p>
                <input
                  type="radio"
                  className="hidden"
                  checked={tap == 'record'}
                  name="groupTap"
                  id="record"
                />
              </label>
            </form>
            {tap == 'record' ? (
              <RecordTap roomName={roomName} token={token} />
            ) : (
              <ParticipantsButton roomName={roomName} identity={identity} />
            )}
          </section>
        </div>
      );
    }, [settingOpen, tap]);

    const ChatButton = useMemo(() => {
      console.log(chatOpen, settingOpen);
      return (
        <ChatToggle
          data-lk-unread-msgs="0"
          aria-pressed={chatOpen}
          className={`lk-button !items-center customChat${
            chatOpen ? '!bg-[var(--lk-control-active-bg)]' : ' !bg-[var(--lk-control-bg)]'
          }`}
          onClick={() => {
            setChatOpen(!chatOpen);
            setSettingOpen(false);
          }}
        >
          <ChatIcon />
          <p
            className={` ${
              (chatOpen || settingOpen || width <= 1020) && !(width >= 1124) && '!hidden '
            }`}
          >
            Chat
          </p>
        </ChatToggle>
      );
    }, [chatOpen, width, settingOpen]);

    const SettingButton = useMemo(() => {
      return (
        <button
          aria-pressed={settingOpen || chatOpen}
          data-lk-unread-msgs="0"
          className={`lk-button !items-center ${
            settingOpen ? '!bg-[var(--lk-control-active-bg)]' : ' !bg-[var(--lk-control-bg)]'
          }`}
          onClick={() => {
            setChatOpen(false);
            setSettingOpen(!settingOpen);
          }}
        >
          <GearIcon />
          <p
            className={` ${
              (chatOpen || settingOpen || width <= 1020) && !(width >= 1124) && '!hidden'
            } `}
          >
            Setting
          </p>
        </button>
      );
    }, [settingOpen, ChatButton, width]);
    return (
      <>
        {liveKitUrl && (
          <LiveKitRoom
            room={room}
            token={token}
            serverUrl={liveKitUrl}
            connectOptions={connectOptions}
            video={userChoices.videoEnabled}
            audio={userChoices.audioEnabled}
            onDisconnected={onLeave}
          >
            <LayoutContextProvider>
              {/* <ParticipantsButton roomName={roomName} identity={''} /> */}
              <div className="flex absolute w-full h-full flex-row-reverse">
                {renderChat}
                {settingOpen && CustomSetting}
                <div className="h-full w-full">
                  <VideoConference
                    chatMessageFormatter={formatChatMessageLinks}
                    SettingsComponent={
                      process.env.NEXT_PUBLIC_SHOW_SETTINGS_MENU === 'true' ? SettingsMenu : undefined
                    }
                  />{' '}
                  <div className="flex items-center justify-center">
                    <ControlBar
                      className="custom-controlBar"
                      variation={`${
                        (chatOpen || settingOpen || width <= 1020) && !(width >= 1124)
                          ? 'minimal'
                          : 'verbose'
                      }`}
                      controls={{ chat: false, settings: false }}
                    />
                    {
                      // isCurrentUserAdmin?
                      <section className="md:lk-control-bar !border-none hover:lk-control-bar !items-center !justify-center !pl-0 md:z-0 z-10 absolute md:static flex flex-col md:flex-row top-5 left-4 lg:top-0 lg:left-2 gap-2 lg:!gap-2.5 ">
                        {ChatButton}
                        {SettingButton}
                        <CopyButton className={'md:!absolute '} />
                        {/* </section>) : 
                    (<section className="lk-control-bar !items-center !justify-center md:!pl-0">
                      {ChatButton}
                      {SettingButton}
                      <CopyButton roomName={roomName}  identity={identity}/> */}
                      </section>
                    }
                  </div>
                </div>
              </div>
            </LayoutContextProvider>
            <DebugMode />
          </LiveKitRoom>
        )}
      </>
    );
  };
