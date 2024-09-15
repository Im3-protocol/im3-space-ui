import Image from 'next/image';
import React from 'react';
import { useState, useRef, useEffect } from 'react';

export function RecordingTimer({ startTime }) {
  console.log('startTime in com', startTime);
  const [elapsedTime, setElapsedTime] = useState(calculateElapsedTime(startTime));
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1000); // Increment by 1 second
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const formattedTime = formatTime(elapsedTime);

  return (
    <section className="flex items-center gap-2">
      <Image src={'/images/record.png'} width={24} height={24} alt={'rec icon'} />
      <p className="">{formattedTime}</p>
    </section>
  );
}

function calculateElapsedTime(startTime) {
  const currentTime = new Date().getTime();
  return currentTime - startTime;
}

function formatTime(milliseconds) {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

  return `${hours}:${minutes}:${seconds}`;
}
