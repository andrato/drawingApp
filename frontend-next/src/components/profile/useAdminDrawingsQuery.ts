import { HOST_DRAWINGS_ADMIN, getDrawingsAdmin } from "@/services/Drawings";
import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "../category/useQueryParams";

export const useAdminDrawingsQuery = ({userId}: {userId: string}) => {
    const {search, startDate, endDate, labels, category} = useQueryParams();

    return useQuery({
        queryKey: [HOST_DRAWINGS_ADMIN, category, search, startDate, endDate, {...labels}],
        queryFn: () => getDrawingsAdmin({
            search, 
            startDate: startDate ? (new Date(startDate)).getTime() : undefined, 
            endDate: endDate ? (new Date(endDate)).getTime() : undefined,
            labels,
            category,
        }), 
        refetchOnMount: false,
        enabled: Boolean(userId) && userId !== null,
    });
}