import { useEffect, useState } from "react";
import { axiosInstance } from "../pages/api/base";


const useGetRecordConfig = (slug: string) => {
    const [ recordConfigData, setConfigRecordData ] = useState<any>();
    
    useEffect(() => {
        fetchRecordConfigData(slug);
    }, [slug])
    
    const fetchRecordConfigData = async (slug: string) => {
        try {
            const response = await axiosInstance.get(`/api/v1/recorder/record-config-type/${slug}`);
            setConfigRecordData(response.data);
         } catch (error) {
             console.log(error);
         }
    }
    return recordConfigData;
}

export default useGetRecordConfig;