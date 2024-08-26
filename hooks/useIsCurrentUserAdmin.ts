import { useState, useEffect } from "react";
import { useGetAdmins } from "./useGetAdmins";

const useIsCurrentUserAdmin = (roomName: string, identity: string) => {
    const { admins, fetchAdmins } = useGetAdmins(roomName);
    const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        fetchAdmins(roomName);
    }, [roomName]);

    useEffect(() => {
        if (admins && admins.length > 0) {
            const ownerIdentity = admins[0].identity;  
            setIsOwner(ownerIdentity === identity);  
            setIsCurrentUserAdmin(admins.some((admin) => admin.identity === identity));
        }
    }, [admins, identity]);

    return { isCurrentUserAdmin, isOwner };
};

export { useIsCurrentUserAdmin };
