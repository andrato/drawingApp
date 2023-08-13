import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "./useQueryParams";
import { HOST_CATEGORY_DRAWINGS, getDrawingByCategory } from "@/services/Drawings";
import { QuerySortToApiSort, SortBy } from "../common/constants";

export const useDrawingsQuery = ({
    category = "gallery", 
    refetchOnMount=false,
    userSortBy,
    userId,
    limit,
    enabled = true,
}: {
    category?: string;
    refetchOnMount?: boolean;
    userSortBy?: SortBy;
    userId?: string;
    enabled?: boolean;
    limit?: number;
}) => {
    const {sortBy, search, startDate, endDate, labels, category: categoryParams, userId: userIdParams} = useQueryParams();
    const computedSortBy = userSortBy ? QuerySortToApiSort[userSortBy] : sortBy;
    const computedCategory = categoryParams ?? category;
    const computedUserId = userIdParams ?? userId;

    return useQuery({
        queryKey: [HOST_CATEGORY_DRAWINGS, computedCategory, computedSortBy, search, startDate, endDate, computedUserId, {...labels}],
        queryFn: () => getDrawingByCategory({
            sortBy: computedSortBy, 
            search, 
            startDate: startDate ? (new Date(startDate)).getTime() : undefined, 
            endDate: endDate ? (new Date(endDate)).getTime() : undefined,
            labels,
            category: computedCategory,
            userId: computedUserId,
            limit,
        }), 
        refetchOnMount,
        enabled,
    });
}