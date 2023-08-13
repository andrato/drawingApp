import { Avatar, Box, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { getUserInfo } from "../common/helpers";
import { USER_INFO_API, getUser } from "@/services/User";
import { UserProfileDrawings } from "./UserProfileDrawings";

export const AVATAR_SIZE = 140;
export const PROFILE_WIDTH = 270;

const Container = ({children}: {children: ReactNode}) => (
    <Box sx={{
        position: "relative",
        width: "calc(100% - 240px)",
        m: 2,
        display: "flex",
        flexDirection: "row",
        gap: 2, 
        justifyContent: "space-between",
    }}>
        {children}
    </Box>
)

export const ProfileInfo = ({userId}: {userId: string}) => {
    const [initials, setInitials] = useState<string>("");

    const {data, isLoading, isError, error} = useQuery({
        queryKey: [USER_INFO_API, userId],
        queryFn: () => getUser(userId), 
        refetchOnMount: false,
        enabled: Boolean(userId) && userId !== null,
    });
    const user = data?.data.user;

    useEffect(() => {
        const userInfo = getUserInfo();
        const firstName = (userInfo && userInfo?.firstName) ?? "";
        const lastName = (userInfo && userInfo?.lastName) ?? "";
        setInitials(firstName[0] + lastName[0]);
    }, []);

    useEffect(() => {
    }, [isLoading]);

    if (isLoading || isError) {
        return <Container><LoadingsAndErrors isLoading={isLoading} isError={isError} /></Container>
    }

    return <Container>
        <Paper sx={(theme) => ({
            p: 2,
            bgcolor: theme.palette.backgroundCustom.profileInfo,
            display: "flex",
            flexDirection: "column",
            height: `calc(100% - ${2 * 16}px)`,
            gap: 3,
            width: PROFILE_WIDTH,
        })}>
            <Box sx={(theme) => ({
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: theme.palette.textCustom.primary,
                mb: 1,
            })}>
                <Avatar
                    alt={initials}
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
                >
                    {initials}
                </Avatar>
                {data.data.user && <Typography variant="body1" sx={{mt: 2}}>
                    {data.data.user?.firstName + " " + data.data.user?.lastName}
                </Typography>}
            </Box>
            <Box sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                color: theme.palette.textCustom.primary,
                gap: 1,
            })}>
                <Typography variant="body2">
                    <strong>{"Member since: "}</strong>
                    {user?.created ? (new Date(user.created)).toDateString() : "-"}
                </Typography>
                <Typography variant="body2">
                    <strong>{"Rating: "}</strong>
                    {user?.rating ?? "-"}
                </Typography>
                <Typography variant="body2">
                    <strong>{"Reviews: "}</strong>
                    {user?.reviews ?? "-"}
                </Typography>
            </Box>
            <Box sx={(theme) => ({
                display: "flex",
                flexDirection: "column",
                color: theme.palette.textCustom.primary
            })}>
                <Typography variant="body2">
                    <strong>About</strong>
                </Typography >
                <Typography variant="body2">
                    {data.data.user?.profile && Object.keys(data.data.user?.profile).length ? "ceva" : "No description available"}
                </Typography>
            </Box>
        </Paper>
        <UserProfileDrawings />
    </Container>;
}