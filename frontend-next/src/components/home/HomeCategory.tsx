import { Alert, Box, CardMedia, CircularProgress, Typography } from "@mui/material";
import { dataToTest } from "../common/testData";
import { useQuery } from "@tanstack/react-query";
import { DrawingTypePartial, getDrawingByCategory } from "@/services/Drawings";
import { ReactNode } from "react";
import { useRouter } from "next/router";

export const Container = ({children}: {children: ReactNode}) => {
    return (<Box sx={(theme) => ({
        bgcolor: theme.palette.backgroundCustom.dark,
        height: "31%",
    })}>
        <Box sx={{
            m: 1,
            mx: 4,
            height: "calc(100% - 16px)"
        }}>
            {children}
        </Box>
    </Box>);
}

export const HomeCategory = ({
    category,
}: {
    category: string;
}) => {
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [category],
        queryFn: () => getDrawingByCategory(category), 
        refetchOnMount: false,
    });
    const router = useRouter();

    if (isLoading) {
        return <Container><CircularProgress /></Container>
    }

    if (isError) {
        return <Container>      
            <Alert severity="error">Error occured when loading data</Alert>
        </Container>
    }

    const drawings: DrawingTypePartial[] = data?.data.drawings;

    const handleClick = (id: string) => {
        router.push(`/gallery/${id}`);
    }

    return (
        <Container>
            <Typography sx={(theme) => ({color: theme.palette.textCustom.primary})}>
                {category}
            </Typography>
            <Box sx={{
                height: "calc(100% - 24px)",
                width: "100%",
                display: "flex", 
                overflow: "scroll",
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
                                        transform: "scale(1.2)",
                                        zIndex: 1,
                                        boxShadow: 2,
                                    }
                                }}
                            />
                        </Box>
                    )
                })};
            </Box>
        </Container>
    );
}