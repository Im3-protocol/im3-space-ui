import Image from 'next/image';
import React, { useCallback, useMemo, useState } from 'react';
import { useEffect } from 'react';
import { useLayoutEffect } from 'react';
import { useCompositeRecorder } from '../../hooks/useCompositeRecorder';

const RecordDropDown = ({ setRecordType }) => {
  const [isDrop, setIsDrop] = useState<boolean>(false);
  const localRecordType = JSON.parse(localStorage.getItem('recording type'));
  const [text, setText] = useState<string | boolean>(localRecordType ?? false);

  useLayoutEffect(() => {
    localStorage.setItem('recording type', JSON.stringify(text));
  }, [text]);

  const showOptionOfDrop = useCallback(() => {
    return (
      <ul
        className={`${
          isDrop && 'opacity-100'
        } opacity-0  transition-all duration-500 ease-in-out rounded-lg overflow-auto`}
      >
        {isDrop && (
          <>
            <li
              onClick={() => {
                setRecordType('speaker');
                setIsDrop(false);
                setText('Record Entire Room Focus Mode');
              }}
              className="p-4 !bg-[var(--lk-control-hover-bg)] cursor-pointer hover:!bg-[var(--lk-border-color)] "
            >
              Record Entire Room Focus Mode
            </li>
            <li
              onClick={() => {
                setRecordType('grid');
                setIsDrop(false);
                setText('Record Entire Room Grid Mode');
              }}
              className="p-4 !bg-[var(--lk-control-hover-bg)] cursor-pointer hover:!bg-[var(--lk-border-color)] "
            >
              Record Entire Room Grid Mode
            </li>
            <li
              onClick={() => {
                setRecordType('audioOnly');
                setIsDrop(false);
                setText('Record Entire Room Audio');
              }}
              className="p-4 !bg-[var(--lk-control-hover-bg)] cursor-pointer hover:!bg-[var(--lk-border-color)] "
            >
              Record Entire Room Audio
            </li>
            <li
              onClick={() => {
                setRecordType('videoOnly');
                setIsDrop(false);
                setText('Record Entire Room Video');
              }}
              className="p-4 !bg-[var(--lk-control-hover-bg)] cursor-pointer hover:!bg-[var(--lk-border-color)] "
            >
              Record Entire Room Video
            </li>
            <li
              onClick={() => {
                setRecordType('adminAudio');
                setIsDrop(false);
                setText("Record Admin's Audio");
              }}
              className="p-4 !bg-[var(--lk-control-hover-bg)] cursor-pointer hover:!bg-[var(--lk-border-color)] "
            >
              Record Admin's Audio
            </li>
          </>
        )}
      </ul>
    );
  }, [isDrop]);

  const updateText = useMemo(() => {
    console.log(text);
    return <p className="">{text ? text : 'Select recording type'}</p>;
  }, [text]);

  return (
    <div className="flex flex-col gap-4">
      <section
        onClick={() => setIsDrop(!isDrop)}
        className="!p-4 !flex !justify-between lk-button !bg-[var(--lk-control-hover-bg)] !w-full hover:bg-[var(--lk-border-color)] rounded-lg "
      >
        {updateText}
        <Image
          className={`${isDrop && 'rotate-180'} transition-all duration-200 ease-in-out`}
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
