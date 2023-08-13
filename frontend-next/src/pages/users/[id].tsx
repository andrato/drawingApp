import { UserProfileDrawings } from "@/components/profile/UserProfileDrawings";
import { Page } from "@/components/utils/helpers/Page";
import { USER_INFO_API, getUser } from "@/services/User";
import { Alert, Avatar, Box, CircularProgress, Paper, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useRef, useState } from "react";

export const AVATAR_SIZE = 140;
export const PROFILE_WIDTH = 270;

// const Container = ({children}: {children: ReactNode}) => (
//     <Box sx={{
//         position: "relative",
//         width: "100%",
//         m: 2,
//         display: "flex",
//         flexDirection: "row",
//         gap: 2, 
//         justifyContent: "space-between",
//     }}>
//         {children}
//     </Box>
// );
export const Container = ({children}: {children: ReactNode}) => (
    <Page hasMarginX={true} sx={{
        display: "flex",
        flexDirection: "row", 
        justifyContent: "space-between",
        overflow: "auto",
        gap: 2,
    }}>
        {children}
    </Page>
)

export default function UserPage()  {
    const router = useRouter();
    const id = router.query.id as string;

    const {data, isLoading, isError, error} = useQuery({
        queryKey: [USER_INFO_API, id],
        queryFn: () => getUser(id), 
        refetchOnMount: false,
        enabled: Boolean(id) && id !== null,
    });
    const user = data?.data.user;
    const initials = (user?.firstName[0] ?? "") + (user?.lastName[0] ?? "")

    if (isLoading) {
        return <Container><CircularProgress /></Container>
    }

    if (isError) {
        return <Container>      
            <Alert severity="error">Error occured when loading data</Alert>
        </Container>
    }

    if (null === user) {
        return null;
    }

    return <Container>
        <Paper sx={(theme) => ({
            p: 2,
            bgcolor: theme.palette.backgroundCustom.profileInfo,
            display: "flex",
            flexDirection: "column",
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
                <Typography variant="body2">
                    <strong>{"Drawings: "}</strong>
                    {user?.drawings ?? 0}
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
        <UserProfileDrawings userId={id}/>
    </Container>;
}