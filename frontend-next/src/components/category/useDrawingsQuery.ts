import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "./useQueryParams";
import { HOST_CATEGORY_DRAWINGS, getDrawingByCategory } from "@/services/Drawings";
import { QuerySortToApiSort, SortBy } from "../common/constants";

export const useDrawingsQuery = ({
    category = "gallery", 
    refetchOnMount=false,
    userSortBy,
    userId,
    enabled = true,
}: {
    category?: string;
    refetchOnMount?: boolean;
    userSortBy?: SortBy;
    userId?: string;
    enabled?: boolean;
}) => {
    const {sortBy, search, startDate, endDate, labels, category: categoryParams} = useQueryParams();
    const computedSortBy = userSortBy ? QuerySortToApiSort[userSortBy] : sortBy;
    const computedCategory = categoryParams ?? category;

    return useQuery({
        queryKey: [HOST_CATEGORY_DRAWINGS, computedCategory, computedSortBy, search, startDate, endDate, {...labels}],
        queryFn: () => getDrawingByCategory({
            sortBy: computedSortBy, 
            search, 
            startDate: startDate ? (new Date(startDate)).getTime() : undefined, 
            endDate: endDate ? (new Date(endDate)).getTime() : undefined,
            labels,
            category: computedCategory,
            userId
        }), 
        refetchOnMount,
        enabled,
    });
}