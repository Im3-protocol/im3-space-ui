'use client'
import React, { useEffect, useMemo, useState } from 'react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';
import Image from 'next/image';

const CopyButton = () => {
  const [isCLick, setIsClick] = useState(false);
  const [url, setUrl] = useState('Copy Space Url')
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const fullUrl = window.location.href;
      setUrl(fullUrl)
    }
  }, [])
  

  useCopyToClipboard(url, isCLick);

  useEffect(() => {

  }, [isCLick]);

  const updateTextOfCopy = useMemo(() => {
    return <p className='text-sm min-[1020px]:inline-block hidden'>{isCLick ? 'Copied' : 'Copy Space Url' }</p>;
  }, [isCLick]);

  return (
    <button
      title={`${isCLick ? 'Copied ' : 'Copy '}` + url}
      onClick={() => {
        setIsClick(true);
      }}
    
      className= "lk-button lk-focus-toggle-button !bg-['#373737'] md:!absolute md:!top-4 md:!left-4 md:!p-1.5 md:!px-2 "
      
    >
      <Image alt="copy" width={16} height={16} src={'/images/copy.png'} />
      {updateTextOfCopy}
    </button>
  );
};

export default CopyButton;
