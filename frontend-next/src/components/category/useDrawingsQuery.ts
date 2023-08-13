import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "./useQueryParams";
import { HOST_CATEGORY_DRAWINGS, getDrawingByCategory } from "@/services/Drawings";
import { QuerySortToApiSort, SortBy } from "../common/constants";

export const useDrawingsQuery = ({
    category = "gallery", 
    refetchOnMount=false,
    userSortBy,
    userId,
}: {
    category?: string;
    refetchOnMount?: boolean;
    userSortBy?: SortBy;
    userId?: string;
}) => {
    const {sortBy, search, startDate, endDate, labels} = useQueryParams();
    const computedSortBy = userSortBy ? QuerySortToApiSort[userSortBy] : sortBy;

    return useQuery({
        queryKey: [HOST_CATEGORY_DRAWINGS, category, computedSortBy, search, startDate, endDate, {...labels}],
        queryFn: () => getDrawingByCategory({
            sortBy: computedSortBy, 
            search, 
            startDate: startDate ? (new Date(startDate)).getTime() : undefined, 
            endDate: endDate ? (new Date(endDate)).getTime() : undefined,
            labels,
            category,
            userId
        }), 
        refetchOnMount,
    });
}