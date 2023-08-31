import { USER_INFO_API, getUser } from "@/services/User";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

export const useProfileUser = (idUser?: string) => {
    const router = useRouter();

    // Get the query parameter from the URL
    const { id } = router.query; 
    const userId = idUser ?? id;
    const queryClient = useQueryClient();

    const {data, ...rest} = useQuery({
        queryKey: [USER_INFO_API, userId],
        queryFn: () => getUser(userId as string), 
        refetchOnMount: false,
        enabled: Boolean(userId) && userId !== null,
    });

    const modifyUser = ({firstName, lastName, about}: {firstName?: string, lastName?: string; about?: string;}) => {
        const user = {
            ...data?.data.user,
            ...(firstName ? {firstName} : {}),
            ...(lastName ? {lastName} : {}),
            profile: {
                ...data?.data.user.profile,
                ...(about ? {about} : {})
            }
        }
        queryClient.setQueryData([USER_INFO_API, userId], {data: {user}});

    }

    return {
        user: data?.data.user,
        modifyUser,
        ...rest
    }
}