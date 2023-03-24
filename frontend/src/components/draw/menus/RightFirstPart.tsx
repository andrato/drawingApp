import { Box, Slider, Input, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useButtonsLeft } from "./useButtonsLeft";
import { drawColors, drawSizes } from "../constants";

type Props = {
    setLineWidth: Function,
}

function PencilSettings (props: Props) {
    const [lineWidth, setLineWidth] = useState(1);

    function handleSliderChange(e: any) {
        setLineWidth(e.target.value);
        props.setLineWidth(e.target.value);
    }

    const handleBlur = () => {
        if (lineWidth < 0) {
            setLineWidth(0);
        } else if (lineWidth > 100) {
            setLineWidth(100);
        }
    };

    return (<Box>
        <Box sx={{
            m: 1,
            display: "flex",
            flexDirection: "column",
        }}>
            <Typography sx={{
                width: "100%",
                fontSize: `${drawSizes.fontSizeMenuText}px`,
                color: `${drawColors.textColor}`,

            }}>Size: </Typography>
            <Box sx={{
                display: "flex",

            }}>
                <Slider
                    value={lineWidth}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="input-slider"
                    sx={{
                        mr: 2,
                        color: `${drawColors.sliderColor}`,
                        '& .MuiSlider-thumb': {
                            width: "12px",
                            height: "12px",
                        },
                    }}
                />
                <Input
                    value={lineWidth}
                    size="small"
                    onChange={handleSliderChange}
                    onBlur={handleBlur}
                    sx={{
                        width: "40px",
                        '> input': {
                            backgroundColor: `${drawColors.textColor}`,
                            color: `${drawColors.backgroundColor}`,
                            px: "4px",
                            fontSize: "12px",
                        },
                        '> input::-webkit-outer-spin-button, >input::-webkit-inner-spin-button': {
                            WebkitAppearance: "none",
                            margin: 0,
                        },
                        '> input[type=number]': {
                            MozAppearance: "textfield",
                        },
                    }}
                    inputProps={{
                        min: 0,
                        max: 100,
                        type: 'number',
                    }}
                />
            </Box>
            
        </Box>
    </Box>)
}

function BrushSettings(props: Props) {
    console.log("in brush settings");

    return (<Box>

    </Box>)
}


const ButtonSettings: Record<string, Function> = {
    "pencil": PencilSettings,
    "brush": BrushSettings,
    "pen": PencilSettings,
    "eraser": PencilSettings,
    "square": PencilSettings,
    "circle": PencilSettings,
}

export function ButtonBodySettings(props: Props) {
    const { getActiveButton } = useButtonsLeft();
    const [button, setButton] = useState<string | null>();
    const Component = button ? ButtonSettings[button] : Box;

    useEffect(() => {
        setButton(getActiveButton());
        console.log("In useEffect " + getActiveButton());

    }, []);

    return (<>
        <Component {...props}/>
    </>)
}

export function ColorSettings() {
    console.log("in color settings");

    return (<>

    </>)
}


export function HistorySettings() {
    console.log("in history settings");

    return (<>

    </>)
}