import { Avatar, Box, Button, Paper, Typography } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { getUserInfo } from "../common/helpers";
import { UserProfileDrawings } from "./UserProfileDrawings";
import { ProfileEditDialog } from "./ProfileEditDialog";
import { useProfileUser } from "./useProfileUser";

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
    const [isEditOpen, setIsEditOpen] = useState<boolean>(false);

    const {user, isLoading, isError, error} = useProfileUser(userId);
    const sameUser = user?._id === userId;

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
                {user && <Typography variant="body1" sx={{mt: 2}}>
                    {user.firstName + " " + user.lastName}
                </Typography>}
                {sameUser && <Button 
                    variant="contained" 
                    size="small" 
                    onClick={() => setIsEditOpen(true)}
                    sx={{mt: 1}}
                >
                    Edit
                </Button>
                }
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
                    {user?.profile && user?.profile.about?.length ? user?.profile.about : "No description available"}
                </Typography>
            </Box>
        </Paper>
        <UserProfileDrawings userId={userId}/>
        <ProfileEditDialog isOpen={isEditOpen} setIsOpen={setIsEditOpen} userId={userId}/>
    </Container>;
}