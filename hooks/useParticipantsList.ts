import axios from "axios";
import { useState } from "react";
import { axiosInstance } from "../pages/api/base";

const useListParticipants = (roomName: string) => {
    const [participants, setParticipants] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchParticipants = async (roomName:string) => {
        setLoading(true);
        setError(null);
        try {
            const result = await axiosInstance.get(`/api/v1/participants/list-participants?room=${roomName}`);
            console.log(result.data);
            setParticipants(result.data); 
        } catch (error) {
            console.log(error);
            setError("Failed to fetch participants");
        } finally {
            setLoading(false);
        }
    };

    return { participants, fetchParticipants, loading, error };
};

export { useListParticipants };
