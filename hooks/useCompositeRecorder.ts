import { useEffect, useState } from "react";
import { axiosInstance } from "../pages/api/base";

type TrackType = {
    sid: string;
    type: string;
    name: string;
    muted: boolean;
    width: number;
    height: number;
    simulcast: boolean;
    disableDtx: boolean;
    source: string;
    layers: any[];
    mimeType: string;
    mid: string;
    codecs: any[];
    stereo: boolean;
    disableRed: boolean;
    encryption: string;
    stream: string;
    version: {
      unixMicro: string;
      ticks: number;
    };
    audioFeatures: string[];
  };
  
  type ParticipantType = {
    sid: string;
    identity: string;
    state: string;
    tracks: TrackType[];
    metadata: string;
    joinedAt: string;
    name: string;
    version: number;
    permission: {
      canSubscribe: boolean;
      canPublish: boolean;
      canPublishData: boolean;
      hidden: boolean;
      recorder: boolean;
      canPublishSources: any[];
      canUpdateMetadata: boolean;
      agent: boolean;
    };
    region: string;
    isPublisher: boolean;
    kind: string;
    attributes: object;
  };
  


const useCompositeRecorder = (participantsList: [object]) => {
    const [isRecording, setRecording] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasError, setError] = useState<string | null>(null);

    // Load isRecording state from local storage on mount
    useEffect(() => {
        const storedState = localStorage.getItem('isRecording');
        if (storedState !== null) {
            setRecording(JSON.parse(storedState));
        }
    }, []);

    // Save isRecording state to local storage when it changes
    useEffect(() => {
        localStorage.setItem('isRecording', JSON.stringify(isRecording));
    }, [isRecording]);

    const startRecording = async (roomName: string, recordType: string) => {
        try {
            setLoading(true);
            if (recordType === 'speaker' || recordType === 'grid') {
                const egressId = await axiosInstance.post(`/api/v1/recorder/start-record-composite/${roomName}`, { audioOnly:false, videoOnly:false, layout: recordType });
                console.log(`egressId for ${recordType} mode: ${egressId.data.egressId}`);
                setRecording(true);
                return egressId;
            }
            if (recordType === 'audioOnly') {
                const egressId = await axiosInstance.post(`/api/v1/recorder/start-record-composite/${roomName}`, { audioOnly:true, videoOnly:false, layout: recordType });
                console.log(`egressId for ${recordType} mode: ${egressId.data.egressId}`);
                setRecording(true);
                return egressId
            }
            if (recordType === 'videoOnly') {
                const egressId = await axiosInstance.post(`/api/v1/recorder/start-record-composite/${roomName}`, { audioOnly:false, videoOnly:true, layout: recordType });
                console.log(`egressId for ${recordType} mode: ${egressId.data.egressId}`);
                setRecording(true);
                return egressId
            }
            if (recordType === 'adminAudio') {
                const identity = localStorage.getItem('identity');
                console.log(participantsList);
            
                const client:any = participantsList.find((participant: any) => participant.identity === identity);
            
                if (client) {
                    const audioTrack = client.tracks.find((track: TrackType) => track.type === 'AUDIO');
                    
                    if (audioTrack) {
                        const trackSid = audioTrack.sid;
                        console.log(`Audio track SID: ${trackSid}`);
            
                        const egressId = await axiosInstance.post(`/api/v1/recorder/start-record-audio/${roomName}/${trackSid}`);
                        console.log(`egressId for ${recordType} mode: ${egressId.data.egressId}`);
            
                        setRecording(true);
                        return egressId;
                    } else {
                        console.log("No audio track found for the participant.");
                    }
                } else {
                    console.log("Participant not found.");
                }
            }
            
            
        } catch (error: any) {
            setError(error.message);
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const stopRecording = async (egressId:string) => {
        try {
            setLoading(true);
            await axiosInstance.post(`/api/v1/recorder/stop-record-composite/${egressId}`);
            setRecording(false);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return { isRecording, loading, hasError, startRecording, stopRecording };
};

export { useCompositeRecorder };
