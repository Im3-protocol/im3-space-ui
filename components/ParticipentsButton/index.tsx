'use client';
import React, { useState, useEffect } from 'react';
import { useListParticipants } from '../../hooks/useParticipantsList';
import { useGetAdmins } from '../../hooks/useGetAdmins';
import MicButton from '../MicButton';
import KickButton from '../KickButton';
import GrantAdminPrivilegesButton from '../GrantAdminPrivilegesButton';
import ParticipantBoxLazy from '../ParticipantBoxLazy';

interface ParticipantType {
  roomName: string;
  identity: string;
}

function ParticipantsButton({ roomName, identity }: ParticipantType) {
  const { participants, fetchParticipants, loading: loadingParticipants } = useListParticipants(roomName);
  const { admins, fetchAdmins, loading: loadingAdmins } = useGetAdmins(roomName);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    fetchParticipants(roomName);
    fetchAdmins(roomName);

    const intervalId = setInterval(() => {
      fetchParticipants(roomName);
      fetchAdmins(roomName);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [roomName]);

  useEffect(() => {
    if (admins && admins.length > 0) {
      const ownerIdentity = admins[0].identity;

      // Determine if the current user is the owner
      setIsOwner(ownerIdentity === identity);

      // Determine if the current user is an admin
      setIsCurrentUserAdmin(admins.some((admin) => admin.identity === identity));
    }
  }, [admins, identity]);

  if (loadingParticipants || loadingAdmins) {
    return (
      <div className="side-panel px-2.5">
        <div className="animate-pulse">
          <ParticipantBoxLazy />
          <ParticipantBoxLazy />
          <ParticipantBoxLazy />
          <ParticipantBoxLazy />
          <ParticipantBoxLazy />
        </div>
      </div>
    );
  }

  const combinedParticipants = participants.filter(
    (participant) => !admins.some((admin) => admin.identity === participant.identity)
  );

  return (
    <div className="side-panel px-2.5">
      <ul className="flex w-full flex-col gap-2 max-h-[85vh] overscroll-y-auto">
        {/* Admins List */}
        {admins.map((admin, index) => {
          const isCurrentAdmin = admin.identity === identity;
          const isAdminOwner = admins[0]?.identity === admin.identity;

          return (
            <li
              key={index}
              className={`flex w-full flex-col p-4 rounded-lg bg-[#111] gap-2 justify-start items-center text-sm ${
                isCurrentAdmin ? 'text-yellow-400' : ''
              }`}
            >
              <section className="flex w-full items-center justify-between ps-1 pb-8">
                <span className={`text-base ${isCurrentAdmin ? 'text-yellow-400' : ''}`}>
                  {admin.participantName}
                </span>
                {isAdminOwner ? (
                  <p className="text-yellow-400 text-xs">Owner</p>
                ) : (
                  <p className="text-yellow-400 text-xs">Admin</p>
                )}
              </section>

              {/* Conditional rendering for Admins */}
              {(isOwner || (isCurrentUserAdmin && !isAdminOwner)) && !isCurrentAdmin && (
                <div className="flex items-center justify-start gap-4 w-full mb-2">
                  <MicButton roomName={roomName} identity={admin.identity} />
                  <GrantAdminPrivilegesButton
                    roomName={roomName}
                    identity={admin.identity}
                    participantName={admin.participantName}
                  />
                  <KickButton roomName={roomName} identity={admin.identity} />
                </div>
              )}
            </li>
          );
        })}

        {/* Participants List */}
        {combinedParticipants.reverse().map((participant, index) => {
          const isCurrentParticipant = participant.identity === identity;

          return (
            <li
              key={index}
              className={`flex w-full py-2.5 flex-col p-3 rounded-lg bg-[#111] gap-2 justify-start items-center text-sm ${
                isCurrentParticipant ? 'text-yellow-400' : ''
              }`}
            >
              <section className="flex w-full items-center justify-between ps-1 pb-8">
                <span className={`text-base ${isCurrentParticipant ? 'text-yellow-400' : ''}`}>
                  {participant.name}
                </span>
                <p className="text-yellow-400 text-xs">Participant</p>
              </section>

              {/* Conditional rendering for Participants */}
              {(isCurrentUserAdmin || isOwner) && (
                <div className="flex items-center justify-start gap-4 w-full mb-2">
                  <MicButton roomName={roomName} identity={participant.identity} />
                  <GrantAdminPrivilegesButton
                    roomName={roomName}
                    identity={participant.identity}
                    participantName={participant.name}
                  />
                  <KickButton roomName={roomName} identity={participant.identity} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ParticipantsButton;
