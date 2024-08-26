import React, { useEffect, useState } from 'react';
import useGrantSpeak from '../../hooks/useGrantPrivileges';
import Image from 'next/image';

function MicButton({ roomName, identity }) {
  const { grantSpeak } = useGrantSpeak();
  const [isMic, setIsMic] = useState(false);
  const [svgMic, setSvgMic] = useState<string>('/');

  const handleGrantSpeak = (identity: string, roomName: string, accessType: string) => {
    setIsMic((prevMicState) => !prevMicState);
    console.log(isMic);
    grantSpeak(identity, roomName, accessType);
  };
  useEffect(() => {
    isMic ? setSvgMic('/images/microphone.png') : setSvgMic('/images/mic.png');
  }, [isMic]);

  return (
    <div 
    title={isMic? "Unmute" : "mute"}
      className="lk-button"
      onClick={() => {
        !isMic
          ? handleGrantSpeak(identity, roomName, 'grant-speak') 
          : handleGrantSpeak(identity, roomName, 'disable-speak');
      }}
    >
      <Image className="lk-button !p-0" src={svgMic} alt={'Mic'} width={16} height={16} />
      {
        isMic? 'Mute' : "Unmute" 
      }
    </div>
  );
}

export default MicButton;
