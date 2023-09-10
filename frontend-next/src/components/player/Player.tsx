import { Box, Slider, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const Player = ({videoUrl, imageUrl}: {videoUrl: string, imageUrl: string}) => {
    let url = videoUrl;
    
    //ToDo: fix this
    if (videoUrl.startsWith("fra")) {
        url = "https://drawings-media.fra1.cdn.digitaloceanspaces.com/videos/" + url.split('/').reverse()[0];
    }

    // url = "https://drawings-media.fra1.cdn.digitaloceanspaces.com/videos/randomName.webm";

    const videoRef= useRef<HTMLVideoElement | null>(null);
    const [playbackRate, setPlaybackRate] = useState(1);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = playbackRate;
        }
    }, [playbackRate]);
  
    const setPlayBack = (e: any) => {
      setPlaybackRate(e.target.value);
    };

    return (
        <Box sx={(theme) => ({
            width: "100%",
            aspectRatio: "16/9",
            // [theme.breakpoints.down(950)]: {
            //     width: "100%",
            // }
        })}>
            <video 
                ref={videoRef}
                height="100%" 
                width="100%" 
                controls
                controlsList="nodownload noplaybackrate"
                poster={imageUrl}
                disablePictureInPicture
            >
                <source src={url} type="video/webm" />
            </video>
            
            <Box sx={{
                display: "flex",
                direction: "row",
                alignItems: "center",
            }}>
                <Typography sx={(theme) => ({
                    mr: 1,
                    // fontSize: theme.customSizes.drawFontSizeMenuText,
                    color: theme.palette.textCustom.primary,

                })}>
                    {"Speed: "}
                </Typography>
                <Slider
                    value={playbackRate}
                    onChange={setPlayBack}
                    min={0.5}
                    max={4}
                    step={0.5}
                    valueLabelDisplay="auto"
                    aria-labelledby="input-slider"
                    sx={(theme) => ({
                        mr: 2,
                        color: theme.palette.canvas.slider,
                        '& .MuiSlider-thumb': {
                            width: "12px",
                            height: "12px",
                        },
                    })}
                />
            </Box>
        </Box>            
    )
}

export default Player;