import React from 'react';
import { DrawingTypePartial, HOST_CATEGORY_DRAWINGS, getDrawingByCategory } from '@/services/Drawings';
import { useQuery } from '@tanstack/react-query';
import { LoadingsAndErrors } from '../utils/helpers/LoadingsAndErrors';
import { Box, CardMedia, Typography } from '@mui/material';
import { useRouter } from 'next/router';

const BREAKPOINT = 980;

const getDrawing = async () => {
    const response = await getDrawingByCategory({category: "Gallery"});

    const dataSorted = {
        data: {
            drawings: response.data?.drawings.sort(function (a, b) {
                return Math.random() - 0.5;
            })
        }
    } 

    return {
        ...response,
        dataSorted,
    }
}

export const Suggestions = ({height}: {height: number | null}) => {
    // TODO: this info should be taken from backend on a specific api call
    // for now, we'll just randomly display drawings
    const router = useRouter();
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [HOST_CATEGORY_DRAWINGS, "Gallery"],
        queryFn: getDrawing,
        refetchOnMount: false,
    });

    const drawings: DrawingTypePartial[] = data?.data?.drawings ?? []; 

    if (isLoading || isError) {
        return <LoadingsAndErrors isLoading={isLoading} isError={isError} />
    }

    const handleClick = (id: string) => {
        router.push(`/gallery/${id}`);
    }

    return <Box sx={(theme) => ({
        width: "300px",
        height: "inherit",
        maxHeight: height ? `${height}px` : 'inherit',
        ml: 3,
        overflowX: "hidden",
        overflowY: "auto",
        backgroundColor: theme.palette.backgroundCustom.dark,
        [theme.breakpoints.down(BREAKPOINT)]: {
            display: 'none',
        }
    })}>
        <Box sx={(theme) => ({
            overflow: "auto",
            p: 3,
            pt: 2,
        })}>
            <Typography variant="subtitle2" sx={({palette}) => ({color: palette.textCustom.subHeader, mb: 2})}>Drawings you might also like</Typography>
            {drawings.map((item, pos) => <Box sx={{position: "relative", mb: 2}}>
                <CardMedia
                    key={pos}
                    component="img"
                    image={item.image.location}
                    alt={item.displayTitle}
                    sx={{
                        mr: 1,
                        position: "relative",
                    }}
                />
                <Box 
                    onClick={() => {
                        handleClick(item.id);
                    }}
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        cursor: "pointer",

                        ':hover': {
                            opacity: 1,
                        },
                    }}
                >
                    <Typography variant="body1" color="textCustom.primary">
                        {item.displayTitle}
                    </Typography>
                </Box>
            </Box>
        )}
        </Box>
        
    </Box>
}