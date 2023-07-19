import { ReactNode, useState } from 'react';
import Player from '@/components/player/Player';
import { Alert, Box, CircularProgress, Rating, Typography } from '@mui/material';
import { DrawingType, HOST_DRAWING, getDrawing } from '@/services/Drawings';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { RatingDrawing } from '@/components/drawing/RatingDrawing';
import { UserBar } from '@/components/drawing/UserBar';
import { Reviews } from '@/components/drawing/Reviews';

const BREAKPOINT = 980;

const Container = ({children}: {children: ReactNode}) => (<Box sx={(theme) => ({
    p: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "left",
    [theme.breakpoints.down(BREAKPOINT)]: {
        p: 2
    }
})}>
    {children}
</Box>)

export default function GalleryItem() {
    const router = useRouter();
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
        <Box sx={(theme) => ({
            width: `calc(100% - 300px)`,
            display: "flex",
            flexDirection: "column",
            [theme.breakpoints.down(BREAKPOINT)]: {
                width: '100%',
            }
        })}>
            <Box sx={{width: "100%"}}>
                <Player url={drawing.video.location}/>
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
                contentCateg={drawing.categories}
                contentText={drawing.description}
            />
            <Reviews drawingId={id} userId={drawing.userId} setReviewInfo={setReviewInfo}/>
        </Box>
        <Box sx={(theme) => ({
            width: "300px",
            height: "100%",
            minHeight: "100%",
            [theme.breakpoints.down(BREAKPOINT)]: {
                display: 'none',
            }
        })}>
        </Box>
        
    </Container>);
}
