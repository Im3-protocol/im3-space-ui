import { useState } from "react";
import { axiosInstance } from "../pages/api/base";

const useGrantPrivileges = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const grantSpeak = async (identity: string, roomName: string, accessType: string) => {
        setLoading(true);
        setError(null);
        const data = { roomName, identity };
        try {
            const result = await axiosInstance.post(`/api/v1/participants/${accessType}`, data);
            console.log(result.data);
        } catch (error) {
            setError("Failed to grant speak permissions.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const grantAdminPrivileges = async (roomName: string, identity: string, participantName:string) => {
        setLoading(true);
        setError(null);
        const data = { roomName, identity, participantName };
        try {
            await grantSpeak(identity, roomName, 'grant-speak');
            const result = await axiosInstance.post(`/api/v1/admin/add-admin`, data);
            console.log(result.data);
        } catch (error) {
            setError("Failed to grant admin privileges.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const removeAdminPrivileges = async (roomName: string, identity: string) => {
        setLoading(true);
        setError(null);
        const data = { roomName, identity };
        try {
            await grantSpeak(identity, roomName, 'disable-speak');
            const result = await axiosInstance.delete(`/api/v1/admin/remove-admin/${identity}`);
            console.log(result.data);
        } catch (error) {
            setError("Failed to remove admin privileges.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return { grantSpeak, loading, error, grantAdminPrivileges, removeAdminPrivileges };
};

export default useGrantPrivileges;
