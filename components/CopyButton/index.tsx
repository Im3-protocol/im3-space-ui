'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import Image from 'next/image';

const CopyButton = ({className}) => {
  const [isCLick, setIsClick] = useState(false);
  const [url, setUrl] = useState('Copy Space Url');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const fullUrl = window.location.href;
      setUrl(fullUrl);
    }
  }, []);

  useCopyToClipboard(url, isCLick);

  useEffect(() => {
    setTimeout(() => {
      setIsClick(false);
    }, 8000);
  }, [isCLick]);

  const updateTextOfCopy = useMemo(() => {
    return (
      <p className="text-sm min-[1020px]:inline-block hidden">
        {isCLick ? 'Copied' : 'Copy Space Link'}
      </p>
    );
  }, [isCLick]);

  return (
    <button
      title={`${isCLick ? 'Copied ' : 'Copy '}` + url}
      onClick={() => {
        setIsClick(true);
      }}
      className={`${className} lk-button lk-focus-toggle-button !bg-['#373737']  md:!top-4 md:!left-4 md:!p-1.5 md:!px-2 `}
    >
      <Image alt="copy" width={16} height={16} src={'/images/copy.svg'} />
      {updateTextOfCopy}
    </button>
  );
};

export default CopyButton;
