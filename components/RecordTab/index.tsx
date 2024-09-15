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
  const [recordType, setRecordType] = useState<string | boolean | null>(null);
  const [isRec, setIsRec] = useState<boolean>(false);
  const { participants, fetchParticipants } = useListParticipants(roomName);

  useLayoutEffect(() => {
    fetchParticipants(roomName);
  }, []);

  console.log('participants in recorder Tab', participants);
  console.log('this is admins', admins);
  const isAdmin = useMemo(() => {
    console.log(
      'is Admin',
      admins.some((admin) => admin.identity == identity),
    );
    console.log(identity);

    return admins.some((admin) => admin.identity == identity);
  }, [admins]);

  const handleDataFromChild = (isRecording: boolean, isType: boolean | string) => {
    // Do something with the received isRecording
    console.log('from child', isRecording);
    setIsRec(isRecording);
  };

  useEffect(() => {
    const fromLocalRecType = JSON.parse(localStorage.getItem('recording type'));
    console.log('record type in local', fromLocalRecType);
    if (!fromLocalRecType || fromLocalRecType == 'Select recording type') {
      console.log(fromLocalRecType, 'in if');
      setRecordType(false);
    }
  }, [isRec]);

  const renderRecordButton = useCallback(() => {
    console.log(!recordType);
    return (
      <RecordButton
        onDataReceived={handleDataFromChild}
        participantsList={participants}
        className={`${!isAdmin && '!cursor-default'} lk-button !w-full !mx-2.5`}
        roomName={roomName}
        isAdmin={isAdmin}
        recordType={recordType ?? true}
      />
    );
  }, [isAdmin, recordType, isRec]);

  const DropDown = useMemo(() => {
    return isAdmin && !isRec && <RecordDropDown setRecordType={setRecordType} />;
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
