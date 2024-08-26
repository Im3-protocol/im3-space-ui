import React, { useEffect, useState } from 'react';
import KickButton from '../KickButton';
import MicButton from '../MicButton';
import { useListParticipants } from '../../hooks/useParticipantsList';

const ParticipantsComponent = ({ roomName }: { roomName: any }) => {
  const { participants, fetchParticipants, loading } = useListParticipants(roomName);
  const [click, setClick] = useState<boolean>(false);
  useEffect(() => {
    fetchParticipants(roomName);
  }, [participants.length]);
  return (
    <div className="flex px-2.5  flex-col gap-2 ">
      <p>{participants.length} Participants</p>
      <ul className="flex flex-col gap-2 overflow-y-scroll max-h-[79.5vh] ">
        {!loading ? (
          participants.map((participant: any, index: any) => (
            <>
              <li
                key={index}
                className="flex gap-2 p-2.5  rounded-lg bg-[#111] justify-between items-center text-sm"
              >
                {participant.name}
                <div className="flex items-center gap-2">
                  <MicButton
                    roomName={roomName}
                    identity={participant.identity}
                  />
                  <KickButton
                    setClick={setClick}
                    click={click}
                    roomName={roomName}
                    identity={participant.identity}
                  />
                </div>
              </li>
            </>
          ))
        ) : (
          <p className='text-red-900'>
            ...
          </p>
        )}
      </ul>
    </div>
  );
};

export default ParticipantsComponent;
