import { useEffect } from 'react';
import {useContentful} from '../../services/Contentful'
import Player from '@/components/player/Player';
import { BodyContainer } from '@/utils/helpers/BodyContainer';
import { Box } from '@mui/material';

export default function GalleryItem() {
    const {getContentfulMedia, getAllContentfulMedia} = useContentful();

    useEffect(() => {
        getAllContentfulMedia().then((res) => console.log(res));
        getContentfulMedia().then((res) => console.log(res));
    }, [])

    return <Box sx={(theme) => ({
        p: 3,
        [theme.breakpoints.down(950)]: {
            p: 0,
            pb: 2,
        }
    })}>
        <Player />
    </Box>
}
