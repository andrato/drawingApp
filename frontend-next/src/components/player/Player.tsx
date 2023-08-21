import { Box } from '@mui/material';
import React from 'react';

const Player = ({videoUrl, imageUrl}: {videoUrl: string, imageUrl: string}) => {
    let url = videoUrl;
    //ToDo: fix this
    if (videoUrl.startsWith("fra")) {
        url = "https://drawings-media.fra1.cdn.digitaloceanspaces.com/videos/" + url.split('/').reverse()[0];
    }

    return (
        <Box sx={(theme) => ({
            width: "100%",
            aspectRatio: "16/9",
            // [theme.breakpoints.down(950)]: {
            //     width: "100%",
            // }
        })}>
            <video 
                height="100%" 
                width="100%" 
                controls
                poster={imageUrl}
            >
                <source src={url} type="video/mp4" />
            </video>
        </Box>            
    )
}

export default Player;