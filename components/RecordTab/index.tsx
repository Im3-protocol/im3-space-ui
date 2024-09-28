import React, { useEffect, useMemo, useState } from 'react';
import { useGetAdmins } from '../../hooks/useGetAdmins';
import useGetIdentity from '../../hooks/useGetIdentity';
import RecordButton from '../RecordButton';
import RecordDropDown from '../RecordDropDown';
import { useListParticipants } from '../../hooks/useParticipantsList';
import { useCallback } from 'react';
import { useLayoutEffect } from 'react';

interface RecordTabType {
  roomName: string;
  token: string;
}

const RecordTap = ({ roomName, token }: RecordTabType) => {
  const { admins } = useGetAdmins(roomName);
  const identity = useGetIdentity(token);
  console.log(JSON.parse(localStorage.getItem('recording type')));
  const [recordType, setRecordType] = useState<string | boolean | null>(
    JSON.parse(localStorage.getItem('recording type')) ?? false,
  );
  const [isRec, setIsRec] = useState<boolean>(false);
  const { participants, fetchParticipants } = useListParticipants(roomName);

  useLayoutEffect(() => {
    fetchParticipants(roomName);
  }, [recordType]);

  const isAdmin = useMemo(() => {
    return admins.some((admin) => admin.identity.toLowerCase() == identity.toLowerCase());
  }, [admins]);

  const handleDataFromChild = (isRecording: boolean, isType: boolean | string) => {
    // Do something with the received isRecording
    setIsRec(isRecording);
  };

  useEffect(() => {
    const egressLocalData = localStorage.getItem('recording type');
    const fromLocalRecType = egressLocalData && JSON.parse(egressLocalData);
    console.log('form local rec type : ', fromLocalRecType, !fromLocalRecType);
    if (!fromLocalRecType || fromLocalRecType == 'Select recording type') {
      setRecordType(false);
    }
  }, [isRec]);

  const renderRecordButton = useCallback(() => {
    console.log('in render record ', recordType);
    return (
      <RecordButton
        onDataReceived={handleDataFromChild}
        participantsList={participants}
        className={`${!isAdmin && '!cursor-default'} lk-button !w-full !mx-2.5`}
        roomName={roomName}
        isAdmin={isAdmin}
        identity={identity}
        recordType={recordType}
      />
    );
  }, [isAdmin, recordType, isRec]);

  const DropDown = useMemo(() => {
    return isAdmin && !isRec && <RecordDropDown setRecordType={setRecordType} roomName={roomName} />;
  }, [isAdmin, isRec]);

  return (
    <>
      <form className="flex flex-col mx-2.5 ">{DropDown}</form>
      <div className=" !absolute w-fill-available !bottom-[10px] border-t-2 pt-2 flex justify-center border-[var(--lk-border-color)]">
        {renderRecordButton()}
      </div>
    </>
  );
};

export default RecordTap;
