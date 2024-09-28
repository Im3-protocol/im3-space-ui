import { useEffect, useState } from "react";
import { axiosInstance } from "../pages/api/base";

const useGetAdmins = (roomName: string | string[] | undefined | any) => {
    const [admins, setAdmins] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=> {
        fetchAdmins(roomName);
    }, [roomName]); 

    const fetchAdmins = async (roomName: string | any) => {
        setLoading(true);
        setError(null);
        try {
            const result = await axiosInstance.get(`/api/v1/admin/admins/sort?sort=room&room=${roomName}`);
            const adminsData = result.data;
            setAdmins(adminsData); 
            console.log('Admins State:', adminsData);
        } catch (error) {
            console.log(error);
            setError("Failed to fetch admins");
        } finally {
            setLoading(false);
        }
    };

    return { admins, fetchAdmins, loading, error };
};

export { useGetAdmins };
