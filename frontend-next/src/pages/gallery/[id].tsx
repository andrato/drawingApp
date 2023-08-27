"use client"

import { ReactNode, useEffect, useRef, useState } from 'react';
import Player from '@/components/player/Player';
import { Alert, Box, CircularProgress, Rating, Typography } from '@mui/material';
import { DrawingType, HOST_DRAWING, getDrawing } from '@/services/Drawings';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { UserBar } from '@/components/drawing/UserBar';
import { Reviews } from '@/components/drawing/Reviews';
import { Suggestions } from '@/components/drawing/Suggestions';
import { debounce } from 'lodash';

const BREAKPOINT = 980;

const Container = ({children}: {children: ReactNode}) => (<Box sx={(theme) => ({
    p: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "left",
    [theme.breakpoints.down(BREAKPOINT)]: {
        p: 2
    },
    overflowX: "hidden",
    // WebkitOverflowScrolling: {
    //     display: "block"
    // }
    "::-webkit-scrollbar": {
        display: "block",
    }
})}>
    {children}
</Box>)

export default function GalleryItem() {
    const router = useRouter();
    const [height, setHeight] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const id = router.query.id as string;
    const [reviewInfo, setReviewInfo] = useState<{rating: number, numberOfRatings: number}>({
        rating: 0,
        numberOfRatings: 0,
    });
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [HOST_DRAWING, id],
        queryFn: () => getDrawing(id), 
        refetchOnMount: false,
    });
    const drawing: DrawingType | null = data?.data.drawing ?? null;

    useEffect(debounce(() => {
        if (ref.current) {
            setHeight(ref.current.clientHeight)
        }
    }, 300), [data?.data?.drawing, reviewInfo])

    if (isLoading) {
        return <Container><CircularProgress /></Container>
    }

    if (isError) {
        return <Container>      
            <Alert severity="error">Error occured when loading data</Alert>
        </Container>
    }

    if (null === drawing) {
        return null;
    }
    
    return (<Container >
        <Box 
            sx={(theme) => ({
                width: `calc(100% - 300px)`,
                display: "flex",
                flexDirection: "column",
                [theme.breakpoints.down(BREAKPOINT)]: {
                    width: '100%',
                }
            })}
        >
            <div ref={ref}>
                <Box sx={{width: "100%"}}>
                    <Player videoUrl={drawing.video.location} imageUrl={drawing.image.location}/>
                </Box>
                <Box sx={{
                    mt: 1,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}>
                    <Typography component="div" variant="h5" color="textCustom.primary" sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                    }}>
                        {drawing.displayTitle}
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                    }}>
                        <Rating
                            value={reviewInfo.rating}
                            precision={0.5}
                            sx={(theme) => ({
                                'svg': {
                                    color: theme.palette.backgroundCustom.star,
                                },
                                'label': {
                                    fontSize: "27px",
                                }
                            })}
                            readOnly
                        />
                        <Typography variant="subtitle2" color="textCustom.primary" sx={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                        }}>
                            <><b>{reviewInfo.rating}</b> {`of ${reviewInfo.numberOfRatings} reviews`}</>
                        </Typography>
                    </Box>
                </Box>
                <UserBar 
                    userId={drawing.userId} 
                    userName={drawing.userInfo.name} 
                    imgPath={drawing.userInfo.imgPath} 
                    date={drawing.created} 
                    drawingVideoPath={drawing.video.location}
                    labels={drawing.labels}
                    description={drawing.description}
                    title={drawing.title}
                    displayTitle={drawing.displayTitle}
                />
                <Reviews drawingId={id} userId={drawing.userId} setReviewInfo={setReviewInfo}/>
            </div>
        </Box>
        <Suggestions height={height}/>
        
    </Container>);
}
