import { Box, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { getUser } from "@/services/User";

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

export const AllUsers = ({userId}: {userId: string}) => {
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [userId],
        queryFn: () => getUser(userId), 
        refetchOnMount: false,
        enabled: Boolean(userId) && userId !== null,
    });

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
            
        </Paper>    
    </Container>;
}