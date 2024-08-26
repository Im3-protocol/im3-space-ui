import axios from 'axios';
import Image from 'next/image';
import React from 'react';
import { axiosInstance } from '../../pages/api/base';

function KickButton({ roomName, identity }) {
  const handleKick = (roomName: string, identity: string) => {
    const data = { roomName, identity };
    axiosInstance.post('/api/v1/participants/kick-participant', data);
  };
  return (
    <div  title = "Kick participant"
      onClick={() => {
        handleKick(roomName, identity);
      }}
      className="lk-button  !bg-red-600 hover:!bg-red-500"
    >
      Kick
      <Image alt="" src={'/images/kick.png'} width={16} height={16} />
    </div>
  );
}

export default KickButton;
