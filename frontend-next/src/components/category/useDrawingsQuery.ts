import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "./useQueryParams";
import { HOST_CATEGORY_DRAWINGS, getDrawingByCategory } from "@/services/Drawings";

export const useDrawingsQuery = ({category}: {category: string}) => {
    const {sortBy, search, startDate, endDate, labels} = useQueryParams();

    return useQuery({
        queryKey: [HOST_CATEGORY_DRAWINGS, category, sortBy, search, startDate, endDate, {...labels}],
        queryFn: () => getDrawingByCategory({
            sortBy, 
            search, 
            startDate: startDate ? (new Date(startDate)).getTime() : undefined, 
            endDate: endDate ? (new Date(endDate)).getTime() : undefined,
            labels,
            category,
        }), 
        refetchOnMount: false,
    });
}