import { Avatar, Box, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useEffect, useState } from "react";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { getUserInfo } from "../common/helpers";
import { USER_INFO_API, getUser } from "@/services/User";

const AVATAR_SIZE = 140;

const Container = ({children}: {children: ReactNode}) => (
    <Box sx={{
        position: "relative",
        width: "calc(100% - 240px)",
        m: 2,
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

    useEffect(() => {
        const userInfo = getUserInfo();
        const firstName = (userInfo && userInfo?.firstName) ?? "";
        const lastname = (userInfo && userInfo?.lastName) ?? "";
        setInitials(firstName[0] + lastname[0]);
    }, []);

    useEffect(() => {
    }, [isLoading]);

    if (isLoading || isError) {
        return <Container><LoadingsAndErrors isLoading={isLoading} isError={isError} /></Container>
    }

    if (!data) {
        return <Container><LoadingsAndErrors isLoading={false} isError={true} /></Container>
    }

    return <Container>
        <Paper sx={(theme) => ({
            p: 2,
            bgcolor: theme.palette.backgroundCustom.profileInfo,
            display: "flex",
            direction: "row",
        })}>
            <Box sx={(theme) => ({
                width: "20%",
                minWidth: `calc(${AVATAR_SIZE}px + 40px)`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: theme.palette.textCustom.primary
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
                m: 2,
                width: "80%",
                display: "flex",
                flexDirection: "column",
                color: theme.palette.textCustom.primary
            })}>
                <Typography variant="body1">
                    About
                </Typography >
                <Typography variant="body2">
                    {data.data.user?.profile && Object.keys(data.data.user?.profile).length ? "ceva" : "No description available"}
                </Typography>
            </Box>
        </Paper>    
    </Container>;
}