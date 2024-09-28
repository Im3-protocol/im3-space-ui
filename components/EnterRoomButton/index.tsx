import styles from "../../styles/EnterRoomButton.module.css";
import Image from 'next/image';
import RecorderIcon from '../../public/images/enterRoom/RecorderIcon.svg';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { randomString, generateRoomId, encodePassphrase } from "../../lib/client-utils";
import useGetConfigData from '../../hooks/useGetConfigData';

const EnterRoomButton = () => {
    const router = useRouter();
    const [e2ee, setE2ee] = useState(false);
    const [sharedPassphrase, setSharedPassphrase] = useState(randomString(64));

    const configData = useGetConfigData();

    const startMeeting = () => {
        const slug = configData?.slug || generateRoomId();
        if (e2ee) {
            router.push(`/rooms/${slug}/${encodePassphrase(sharedPassphrase)}`);
        } else {
            router.push(`/rooms/${slug}`);
        }
    };

    return (
        <button className={styles.btn} onClick={startMeeting}>
            <Image
                src={RecorderIcon}
                width={24}
                height={24}
                alt="Im3_Logo"
            />
            <span className="hover:font-bold">Start new Space</span>
        </button>
    );
};

export default EnterRoomButton;
