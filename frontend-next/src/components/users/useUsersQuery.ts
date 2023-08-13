import { USERS_FILTERS_API, getUsersFilters } from "@/services/User";
import { useQuery } from "@tanstack/react-query";

export const useUsersQuery = () => {
    return useQuery({
        queryKey: [USERS_FILTERS_API],
        queryFn: () => getUsersFilters(), 
        refetchOnMount: false,
    });

}