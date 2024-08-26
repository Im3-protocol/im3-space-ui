import React, { useEffect, useState } from 'react';
import useGrantPrivileges from '../../hooks/useGrantPrivileges';
import { useGetAdmins } from '../../hooks/useGetAdmins';
import { useListParticipants } from '../../hooks/useParticipantsList';
import Image from 'next/image';

function GrantAdminPrivilegesButton({ roomName, identity, participantName }) {
  const { fetchParticipants } = useListParticipants(roomName);
  const { admins, fetchAdmins } = useGetAdmins(roomName);
  const [isAdmin, setAdmin] = useState(false);

  useEffect(() => {
    fetchParticipants(roomName);
    fetchAdmins(roomName);
  }, [roomName]);

  useEffect(() => {
    if (admins && admins.length > 0) {
      const isAdmin = admins.some((admin) => admin.identity === identity);
      setAdmin(isAdmin);
    }
  }, [admins, identity]);

  const { grantAdminPrivileges, removeAdminPrivileges } = useGrantPrivileges();

  const handleAdminPrivileges = (roomName: string, identity: string, participantName:string) => {
    if (!isAdmin) {
      grantAdminPrivileges(roomName, identity, participantName);
      setAdmin((prevAdminState) => !prevAdminState);
    }
    if (isAdmin) {
      removeAdminPrivileges(roomName, identity);
      setAdmin((prevAdminState) => !prevAdminState);
    }
  };

  return (
    <div title={isAdmin? "Remove Admin Privileges" : "Grant Admin Privileges"}
    className="lk-button" onClick={() => handleAdminPrivileges(roomName, identity, participantName)}>
        <Image alt="" src={'/images/switch.png'} width={16} height={16} />
        {isAdmin? "Remove Admin" : "Grant Admin"}
    </div>
  );
}

export default GrantAdminPrivilegesButton;
