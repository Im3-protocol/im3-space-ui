'use client';
import React, { useState, useEffect, useMemo, memo } from 'react';
import { useCompositeRecorder } from '../../hooks/useCompositeRecorder';
import { RecordButtonType } from '../../lib/types';
import { RecordingTimer } from '../RecordingTimer';
import { useLayoutEffect } from 'react';

function RecordButton({
  roomName,
  isAdmin,
  className,
  recordType,
  participantsList,
  onDataReceived,
}: RecordButtonType) {
  const { isRecording, hasError, startRecording, stopRecording } =
    useCompositeRecorder(participantsList);
  const [egressId, setEgressId] = useState<string | null>(null);
  useLayoutEffect(() => {
    const storedEgressId = localStorage.getItem('egressId');
    if (storedEgressId) {
      setEgressId(storedEgressId);
    }
  }, []);

  useEffect(() => {
    console.log('this is recording', isRecording);
    console.log('this is type', recordType);
  }, [isRecording]);

  const startRecordingHandler = async () => {
    try {
      const response = await startRecording(roomName, recordType);
      const responseEgressId = response?.data?.egressId;
      setEgressId(responseEgressId);
      localStorage.setItem('record time', JSON.stringify(new Date().getTime()));
      // Store egressId in local storage
      handleClick(!isRecording);
      localStorage.setItem('egressId', responseEgressId);
      console.log('Egress ID received:', responseEgressId);
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const stopRecordingHandler = () => {
    if (!egressId) {
      console.error('No egressId available to stop recording');
      return;
    }
    stopRecording(egressId);
    handleClick(!isRecording);
    localStorage.removeItem('egressId');
    localStorage.removeItem('record time');
    localStorage.removeItem('recording type');
    setEgressId(null);
  };

  const updateText = useMemo(() => {
    return isAdmin ? 'Start Recording' : 'Just admin or owner can Start Recording';
  }, [isAdmin]);

  const handleClick = (data: boolean) => {
    console.log('from t handle click', data);
    onDataReceived(data);
  };

  return (
    <>
      {hasError && <p>{hasError}</p>}
      {isAdmin ? (
        <button
          className={`${className} ${isRecording && '!bg-[var(--lk-danger)]'} lk-button ${
            !recordType ? '!cursor-default' : '!cursor-pointer'
          } !w-full !mx-2.5`}
          disabled={!recordType || (egressId === undefined && recordType === 'adminAudio')}
          onClick={isRecording ? stopRecordingHandler : startRecordingHandler}
        >
          {!isRecording ? (
            egressId === undefined && recordType === 'adminAudio' ? (
              <span> Please open your mic before recording</span>
            ) : (
              <span>Start Recording</span>
            )
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

export default memo(RecordButton);
