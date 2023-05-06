import { ReactNode } from 'react';
import Player from '@/components/player/Player';
import { Alert, Box, CircularProgress } from '@mui/material';
import { DrawingType, getDrawing } from '@/services/Drawings';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

const Container = ({children}: {children: ReactNode}) => (<Box sx={(theme) => ({
    p: 3,
    [theme.breakpoints.down(950)]: {
        p: 0,
        pb: 2,
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

    if (isLoading) {
        return <Container><CircularProgress /></Container>
    }

    if (isError) {
        return <Container>      
            <Alert severity="error">Error occured when loading data</Alert>
        </Container>
    }

    const drawing: DrawingType = data?.data.drawing;
    
    return <Container>
        <Player url={drawing.video.location}/>
    </Container>
}
