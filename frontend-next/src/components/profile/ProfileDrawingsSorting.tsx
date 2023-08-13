import { Box, CardMedia, Typography } from "@mui/material";
import { DrawingTypePartial } from "@/services/Drawings";
import { ReactNode } from "react";
import { useRouter } from "next/router";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { useDrawingsQuery } from "../category/useDrawingsQuery";
import { SortBy } from "../common/constants";
import { getUserInfo } from "../common/helpers";

export const Container = ({children}: {children: ReactNode}) => {
    return (<Box sx={(theme) => ({
        bgcolor: theme.palette.backgroundCustom.dark,
        height: "31%",
    })}>
        <Box sx={{
            m: 1,
            mx: 2,
            height: "calc(100% - 16px)"
        }}>
            {children}
        </Box>
    </Box>);
}

export const ProfileDrawingsSorting = ({
    sortBy,
}: {
    sortBy: SortBy;
}) => {
    const userInfo = getUserInfo();
    const userId = userInfo?.id;
    const {data, isLoading, isError, error} = useDrawingsQuery({
        userSortBy: sortBy, 
        refetchOnMount: true,
        userId,
    });
    const router = useRouter();

    if (isLoading || isError) {
        return <Container><LoadingsAndErrors isLoading={isLoading} isError={isError} /></Container>
    }

    const drawings: DrawingTypePartial[] = data?.data.drawings;

    const handleClick = (id: string) => {
        router.push(`/gallery/${id}`);
    }

    return (
        <Container>
            <Typography sx={(theme) => ({color: theme.palette.textCustom.primary})}>
                {sortBy}
            </Typography>
            <Box sx={{
                height: "calc(100% - 24px)",
                width: "100%",
                display: "flex", 
                overflowX: "scroll",
                "::-webkit-scrollbar": {
                    display: "none",
                },
                alignItems: "center"
            }}>
                {drawings.map((item) => {
                    return (
                        <Box sx={{
                            height: "90%",
                        }}>
                            <CardMedia
                                key={item.id}
                                component="img"
                                image={item.image.location}
                                alt="Paella dish"
                                onClick={() => handleClick(item.id)}
                                sx={{
                                    mr: 1,
                                    transition: "all .2s ease-in-out", 
                                    position: "relative",
                                    width: "auto",
                                    height: "100%",
                                    ":hover" : {
                                        transform: "scale(1.15)",
                                        zIndex: 1,
                                        boxShadow: 2,
                                    }
                                }}
                            />
                        </Box>
                    )
                })}
            </Box>
        </Container>
    );
}