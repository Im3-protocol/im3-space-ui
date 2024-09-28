'use client';
import React, { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { useCompositeRecorder } from '../../hooks/useCompositeRecorder';
import { RecordButtonType } from '../../lib/types';
import { RecordingTimer } from '../RecordingTimer';
import { useLayoutEffect } from 'react';
import useGetRecordConfig from '../../hooks/useRecordConfig';
import { useListParticipants } from '../../hooks/useParticipantsList';

function RecordButton({
  roomName,
  isAdmin,
  className,
  recordType,
  participantsList,
  onDataReceived,
  identity,
}: // setRecordType,
RecordButtonType) {
  const { isRecording, hasError, startRecording, stopRecording } =
    useCompositeRecorder(participantsList);
  const { participants, fetchParticipants } = useListParticipants(roomName);

  useLayoutEffect(() => {
    fetchParticipants(roomName);
  }, [recordType]);

  const [egressId, setEgressId] = useState<string | null>(null);
  useLayoutEffect(() => {
    const storedEgressId = localStorage.getItem('egressId');
    if (storedEgressId) {
      setEgressId(storedEgressId);
    }
  }, []);

  const isMute = useMemo(() => {
    console.log('this is participent list', participants);
    let isMuted = true;
    const getThisParticipent = participants.filter(
      (part) => part.identity.toLowerCase() == identity.toLowerCase(),
    );

    if (
      getThisParticipent[0] &&
      getThisParticipent[0].tracks.length > 0 &&
      getThisParticipent[0].tracks[0].type == 'AUDIO'
    ) {
      console.log(
        'this is the specific part ',
        getThisParticipent[0].tracks.length,
        getThisParticipent[0].tracks[0].type,
      );
      isMuted = getThisParticipent[0].tracks[0].muted;
      console.log('is Muted or not ', isMuted, getThisParticipent[0].tracks[0].type);
    }
    return isMuted;
  }, [recordType, participants]);

  const configData = useGetRecordConfig(roomName);
  const isRoomRecord = configData?.recordRoom;

  const startRecordingHandler = async () => {
    try {
      const response = await startRecording(roomName, recordType);
      console.log('in start', recordType);
      const responseEgressId = response?.data?.egressId;
      setEgressId(responseEgressId);
      localStorage.setItem('record time', JSON.stringify(new Date().getTime()));
      // Store egressId in local storage
      handleClick(!!responseEgressId);
      localStorage.setItem('egressId', responseEgressId);
    } catch (error) {}
  };

  const stopRecordingHandler = () => {
    if (!egressId) {
      return;
    }
    stopRecording(egressId);
    handleClick(false);
    localStorage.removeItem('egressId');
    localStorage.removeItem('record time');
    localStorage.removeItem('recording type');
    setEgressId(null);
  };

  const updateText = useMemo(() => {
    return isAdmin ? 'Start Recording' : 'Just admin or owner can Start Recording';
  }, [isAdmin]);

  const handleClick = (data: boolean) => {
    onDataReceived(data);
  };

  const checking = useMemo(() => {
    console.log(recordType, JSON.parse(localStorage.getItem('recording type')), 5550);
    console.log(isMute);
    if ((recordType === 'adminAudio' || recordType == `Record Admin's Audio`) && isMute) {
      return <span> Please open your mic before recording</span>;
    } else {
      return <span>Start Recording</span>;
    }
  }, [recordType, participants]);

  return (
    <>
      {hasError && <p>{hasError}</p>}
      {isAdmin ? (
        <button
          className={`${className} lk-button ${
            !recordType ||
            ((recordType === 'adminAudio' || recordType == `Record Admin's Audio`) && isMute)
              ? '!cursor-default'
              : '!cursor-pointer'
          } !w-full !mx-2.5`}
          disabled={
            (isMute && (recordType === 'adminAudio' || recordType == `Record Admin's Audio`)) ||
            !recordType ||
            !isRoomRecord
          }
          onClick={egressId ? stopRecordingHandler : startRecordingHandler}
        >
          {!egressId ? (
            checking
          ) : (
            <>
              <RecordingTimer startTime={JSON.parse(localStorage.getItem('record time'))} />
              <span>(Stop Recording)</span>
            </>
          )}
        </button>
      ) : (
        <button className="lk-button !w-full !mx-2.5" disabled>
          {updateText}
        </button>
      )}
    </>
  );
}

export default RecordButton;
