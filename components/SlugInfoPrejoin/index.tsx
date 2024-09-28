import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import useGetConfigData from '../../hooks/useGetConfigData';
import CopyButton from '../CopyButton';

type SlugType = {
  roomName: string;
}

const SlugInfoPreJoin = ({roomName}:any) => {
  console.log(roomName);
  const configData = useGetConfigData(roomName);
  console.log(configData);
  return (
    <div className="col-span-full !rounded-lg md:col-span-1 h-fit !max-w-[750px] p-4 md:p-7 preJoin-wrapper Home_tabContainer__OWE3m  bg-[#1b1b1b]">
      <div className="flex flex-col justify-center gap-4">
        <div className="flex flex-wrap md:flex-col md:justify-center items-center md:items-stretch gap-4">
          <Image src={configData?.logo} width={120} height={120} alt="" />
          <section className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl capitalize font-bold">{configData?.title}</h1>
            <div className="flex items-center gap-1 px-1.5 py-1 bg-[var(--lk-control-active-bg)] rounded-full">
              {configData?.privateRoom && (
                <Image src={'/images/padlock.png'} width={16} height={16} alt="private_icon" />
              )}
              <span className="text-sm  ">{configData?.privateRoom ? 'Private' : 'Public'}</span>
            </div>
          </section>
        </div>
        <p className="text-base md:text-lg  text-zinc-400">{configData?.desc}</p>
      </div>
      <section className='flex mt-4 flex-col gap-4'>
        <h2 className="text-lg">Follow us on :</h2>
        <ul className="flex flex-wrap justify-between gap-4 items-center">
          {configData?.socials.x && (
            <Link href={`${configData.socials.x}`} className="cursor-pointer">
              <Image src={'/images/x.svg'} title="X" width={24} height={24} alt="X" />
            </Link>
          )}
          {configData?.socials.instagram && (
            <Link href={'/'} className="cursor-pointer">
              <Image
                title="instagram"
                className="rounded-full"
                src={'/images/instagram.png'}
                width={24}
                height={24}
                alt="instagram"
              />
            </Link>
          )}
          {configData?.socials.youtube && (
            <Link href={configData?.socials.youtube} className="cursor-pointer">
              <Image
                src={'/images/youtube.png'}
                title="youtube"
                width={32}
                height={32}
                alt="Youtube"
              />
            </Link>
          )}
          {configData?.socials.discord && (
            <Link href={configData?.socials.discord} className="cursor-pointer">
              <Image
                title="discord"
                src={'/images/discord.png'}
                width={32}
                height={32}
                alt="discord"
              />
            </Link>
          )}
          {configData?.socials.github && (
            <Link href={configData?.socials.github} className="cursor-pointer">
              <Image
                title="github"
                className="rounded-full"
                src={'/images/github.svg'}
                width={24}
                height={24}
                alt="github"
              />
            </Link>
          )}
          {configData?.socials.website && (
            <Link href={configData?.socials.website} className="cursor-pointer">
              <Image
                title="Website"
                src={configData?.logo}
                width={24}
                height={24}
                alt="Website"
              />
            </Link>
          )}
          {configData?.socials.phoneNumber && (
            <Link href={'/'} className="flex items-center gap-2">
              <Image
                src={'/images/phone.png'}
                title="1-855-434-7339"
                width={24}
                height={24}
                alt="Phone"
              />
              <span className="hidden md:inline-block">1-855-434-7339</span>
            </Link>
          )}
          {configData?.socials.email && (
            <Link href={'/'} className="flex items-center gap-2">
              <Image
                src={'/images/gmail.png'}
                title="im3@gmail.com"
                width={24}
                height={24}
                alt="Gmail"
              />
              <span className="hidden md:inline-block">im3@gmail.com</span>
            </Link>
          )}
          <CopyButton
            className={
              '!static [&>p]:md:inline-block !bg-transparent hover:!bg-[var(--lk-control-bg)] !p-0 md:!px-2 md:!py-1.5'
            }
          />
        </ul>
      </section>
    </div>
  );
};

export default SlugInfoPreJoin;
