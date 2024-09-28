import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLayoutEffect } from 'react';
import useGetRecordConfig from '../../hooks/useRecordConfig';

const RecordDropDown = ({ setRecordType, roomName }) => {
  const [isDrop, setIsDrop] = useState<boolean>(false);
  const localRecordType = JSON.parse(localStorage.getItem('recording type') || 'null');
  const [text, setText] = useState<string | boolean>(localRecordType ?? false);

  useLayoutEffect(() => {
    if (text) {
      localStorage.setItem('recording type', JSON.stringify(text));
    }
  }, [text]);

  const configData = useGetRecordConfig(roomName);
  console.log('This is recordConfig', configData);
  const isRecordRoom = configData?.recordRoom;
  const isRecordTypes = configData?.recordTypes;

  const showOptionOfDrop = useCallback(() => {
    return (
      <ul
        className={`${
          isDrop ? 'opacity-100' : 'opacity-0'
        } transition-all duration-500 ease-in-out rounded-lg overflow-auto`}
      >
        {isDrop && (
          <>
            {
              isRecordTypes.includes("speaker") && (
                <li
              onClick={() => {
                setRecordType('speaker');
                setIsDrop(false);
                setText('Record Entire Room Focus Mode');
              }}
              className="p-4 !bg-[var(--lk-control-hover-bg)] cursor-pointer hover:!bg-[var(--lk-border-color)]"
            >
              Record Entire Room Focus Mode
            </li>
              )
            }
            { isRecordTypes.includes("grid") && (
              <li
              onClick={() => {
                setRecordType('grid');
                setIsDrop(false);
                setText('Record Entire Room Grid Mode');
              }}
              className="p-4 !bg-[var(--lk-control-hover-bg)] cursor-pointer hover:!bg-[var(--lk-border-color)]"
            >
              Record Entire Room Grid Mode
            </li>)
            }
            { isRecordTypes.includes("audioOnly") &&
            (<li
              onClick={() => {
                setRecordType('audioOnly');
                setIsDrop(false);
                setText('Record Entire Room Audio');
              }}
              className="p-4 !bg-[var(--lk-control-hover-bg)] cursor-pointer hover:!bg-[var(--lk-border-color)]"
            >
              Record Entire Room Audio
            </li>)}
            { isRecordTypes.includes("videoOnly") &&
            (<li
              onClick={() => {
                setRecordType('videoOnly');
                setIsDrop(false);
                setText('Record Entire Room Video');
              }}
              className="p-4 !bg-[var(--lk-control-hover-bg)] cursor-pointer hover:!bg-[var(--lk-border-color)]"
            >
              Record Entire Room Video
            </li>)}
            { isRecordTypes.includes("adminAudio") &&
            (<li
              onClick={() => {
                setRecordType('adminAudio');
                setIsDrop(false);
                setText("Record Admin's Audio");
              }}
              className="p-4 !bg-[var(--lk-control-hover-bg)] cursor-pointer hover:!bg-[var(--lk-border-color)]"
            >
              Record Admin's Audio
            </li>)}
          </>
        )}
      </ul>
    );
  }, [isDrop, isRecordRoom, setRecordType]);

  const updateText = useMemo(() => {
    console.log(text);
    return <p>{text ? text : 'Select recording type'}</p>;
  }, [text]);

  return (
    <div className="flex flex-col gap-4">
      <section
        onClick={() => {
          if (isRecordRoom) {
            setIsDrop(!isDrop);
          }
        }}
        className={`!p-4 !flex !justify-between lk-button !bg-[var(--lk-control-hover-bg)] !w-full ${
          isRecordRoom ? 'hover:bg-[var(--lk-border-color)]' : 'cursor-not-allowed opacity-50'
        } rounded-lg`}
      >
        {updateText}
        <Image
          className={`${isDrop ? 'rotate-180' : ''} transition-all duration-200 ease-in-out`}
          src={'/images/arrow-down.svg'}
          width={24}
          height={24}
          alt=""
        />
      </section>
      {showOptionOfDrop()}
    </div>
  );
};

export default RecordDropDown;
