import { Box } from '@mui/material';
import React from 'react';

const Player = ({url}: {url: string}) => {
    return (
        <Box sx={(theme) => ({
            width: "100%",
            aspectRatio: "16/9",
            // [theme.breakpoints.down(950)]: {
            //     width: "100%",
            // }
        })}>
            <video height="100%" width="100%" controls>
                <source src={url} type="video/webm" />
            </video>
        </Box>            
    )
}

export default Player;