import { ReactNode } from 'react';
import Player from '@/components/player/Player';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { DrawingType, getDrawing } from '@/services/Drawings';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Ratings } from '@/components/drawing/Ratings';
import { UserBar } from '@/components/drawing/UserBar';

const BREAKPOINT = 980;

const Container = ({children}: {children: ReactNode}) => (<Box sx={(theme) => ({
    m: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "left",
    [theme.breakpoints.down(BREAKPOINT)]: {
        m: 2
    }
})}>
    {children}
</Box>)

export default function GalleryItem() {
    const router = useRouter();
    const id = router.query.id as string;
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [id],
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
                    <Ratings ratingNumber={drawing.likes} userId={drawing.userId} />
                    <Typography variant="subtitle2" color="textCustom.primary" sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                    }}>
                        {`${drawing.likes} votes`}
                    </Typography>
                </Box>
                <UserBar userId={drawing.userId} />
            </Box>
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
