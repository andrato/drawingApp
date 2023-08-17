import { Box, Slider, Input, Typography } from "@mui/material";
import { useState, useEffect, ReactNode } from "react";
import { useButtonsLeft } from "./useButtonsLeft";

const CustomSlider = ({
    onBlur,
    onChange,
    value,
    label,
}: {
    onBlur: (e: any) => void;
    onChange: (e: any) => void;
    value: number;
    label: string;
}) => {
    return  <>
        <Typography sx={(theme) => ({
            width: "100%",
            fontSize: theme.customSizes.drawFontSizeMenuText,
            color: theme.palette.textCustom.primary,

        })}>
            {label}
        </Typography>
        <Box sx={{
            display: "flex",

        }}>
            <Slider
                value={value}
                onChange={onChange}
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
            <Input
                value={value}
                size="small"
                onChange={onChange}
                onBlur={onBlur}
                sx={(theme) => ({
                    width: "40px",
                    '> input': {
                        backgroundColor: theme.palette.textCustom.primary,
                        color: theme.palette.canvas.bgColor,
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
                })}
                inputProps={{
                    min: 0,
                    max: 100,
                    type: 'number',
                }}
            />
        </Box>
    </>
}

function PencilSettings () {
    const [lineWidth, setLineWidth] = useState(1);
    const [opacity, setOpacity] = useState(100);

    function handleSliderChange(e: any) {
        setLineWidth(e.target.value);
        sessionStorage.setItem('lineWidth', e.target.value);
        // props.setLineWidth(e.target.value);
    }

    function handleOpacityChange(e: any) {
        setOpacity(e.target.value);
        sessionStorage.setItem('opacity', e.target.value);
    }

    const handleBlur = () => {
        if (lineWidth < 0) {
            setLineWidth(0);
        } else if (lineWidth > 100) {
            setLineWidth(100);
        }
    };

    const handleOpacityBlur = () => {
        if (opacity < 0) {
            setOpacity(0);
        } else if (opacity > 100) {
            setOpacity(100);
        }
    };

    return (<Box>
        <Box sx={{
            m: 1,
            display: "flex",
            flexDirection: "column",
        }}>
            <CustomSlider 
                onBlur={handleBlur}
                onChange={handleSliderChange}
                value={lineWidth}
                label={"Size:"}
            />
            <CustomSlider 
                onBlur={handleOpacityBlur}
                onChange={handleOpacityChange}
                value={opacity}
                label={"Opacity:"}
            />
        </Box>
    </Box>)
}

function BrushSettings() {
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

export function ButtonBodySettings() {
    const { getActiveButton } = useButtonsLeft();
    const [button, setButton] = useState<string | null>();
    // const Component = button ? ButtonSettings[button] : Box;

    useEffect(() => {
        setButton(getActiveButton());
    }, []);

    return (<>
        {/* <Component /> */}
        <PencilSettings />
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