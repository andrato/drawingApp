import { Box, Slider, Input, Typography, FormControlLabel, FormGroup, Checkbox, FormControlLabelProps } from "@mui/material";
import { useState, useImperativeHandle, RefObject } from "react";
import { Buttons } from "./utils";
import { publish } from "../events";
import { OptionsType } from "../types";

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

const FormControlStyled = (props: FormControlLabelProps) => {
    return <FormControlLabel 
        sx={(theme) => ({
            'span' : {
                fontSize: theme.customSizes.drawFontSizeMenuText,
                color: theme.palette.textCustom.primary,
            },
            '.Mui-disabled': {
                color: `${theme.palette.textCustom.disabled} !important`,

            }
        })}
        {...props}
    />
}

export type ActionsMenuRightType = RefObject<{
    onActionChange: (button: Buttons, color: string) => void;
}>;


export function ButtonBodySettings ({
    actionsMenuRight,
}: {
    actionsMenuRight?: ActionsMenuRightType;
}) {
    const [button, setButton] = useState<Buttons>(Buttons.BRUSH);

    const [options, setOptions] = useState<OptionsType>({
        lineWidth: 1,
        opacity: 100,
        color: "#000000",
        sameColorAsLine: false,
        fillColor: "#000000",
        isFillEnabled: false,
    });

    useImperativeHandle(actionsMenuRight, () => ({
        onActionChange (activeButton: Buttons, lineColor: string) {
            setButton(activeButton);

            const updatedOptions = {
                ...options,
                color: lineColor,
                fillColor: options.sameColorAsLine ? lineColor : '#000000',
            };

            setOptions(updatedOptions);

            publish("optionSettings", updatedOptions);
        }
    }));

    function handleSliderChange(e: any) {
        const updatedOptions = {
            ...options,
            lineWidth: e.target.value,
        }

        setOptions(updatedOptions);
        publish("optionSettings", updatedOptions);
    }

    function handleOpacityChange(e: any) {
        const updatedOptions = {
            ...options,
            opacity: e.target.value,
        }

        setOptions(updatedOptions);
        publish("optionSettings", updatedOptions);
    }

    const handleBlur = () => {
        if (options.lineWidth < 0) {
            setOptions({
                ...options,
                lineWidth: 0,
            });
        } else if (options.lineWidth  > 100) {
            setOptions({
                ...options,
                lineWidth: 100,
            });
        }
    };

    const handleOpacityBlur = () => {
        if (options.opacity < 0) {
            setOptions({
                ...options,
                opacity: 0,
            });
        } else if (options.opacity > 100) {
            setOptions({
                ...options,
                opacity: 100,
            });
        }
    };

    const handleIsSameColor = () => {
        const sameColor = !options.sameColorAsLine;

        const updatedOptions = {
            ...options,
            sameColorAsLine: sameColor,
            fillColor: sameColor ? options.color : options.fillColor,
        };

        setOptions(updatedOptions);

        publish("optionSettings", updatedOptions);
    }

    const handleFillShape = () => {
        const fillEnabled = !options.isFillEnabled;

        const updatedOptions = {
            ...options,
            isFillEnabled: fillEnabled,
        };

        setOptions(updatedOptions);

        publish("optionSettings", updatedOptions);
    }

    return (<Box>
        <Box sx={{
            m: 1,
            display: "flex",
            flexDirection: "column",
        }}>
            <CustomSlider 
                onBlur={handleBlur}
                onChange={handleSliderChange}
                value={options.lineWidth}
                label={"Size:"}
            />
            <CustomSlider 
                onBlur={handleOpacityBlur}
                onChange={handleOpacityChange}
                value={options.opacity}
                label={"Opacity:"}
            />
            {(button === Buttons.CIRCLE || button === Buttons.SQUARE) && <>
                <FormGroup row>
                    <FormControlStyled control={<Checkbox size="small" value={options.isFillEnabled} onClick={handleFillShape}/>} label="Fill Shape" />
                    <FormControlStyled 
                        control={<Checkbox size="small" value={options.sameColorAsLine} onClick={handleIsSameColor}/>} 
                        label="Same line color"
                        disabled={!options.isFillEnabled} 
                    />
                </FormGroup>
                {options.isFillEnabled && <Box sx={{display: options.sameColorAsLine ? 'none' : 'auto'}}>
                    <Typography sx={(theme) => ({
                        mt: 1,
                        width: "100%",
                        fontSize: theme.customSizes.drawFontSizeMenuText,
                        color: theme.palette.textCustom.primary,

                    })}>
                        Choose a color for fill:
                    </Typography>
                    <Input 
                        type="color" 
                        name="favcolor" 
                        value={options.fillColor} 
                        onChange={(event) => {
                            const newColor = event.target.value;

                            const updatedOptions = {
                                ...options,
                                fillColor: newColor,
                            };
                    
                            setOptions(updatedOptions);
                    
                            publish("optionSettings", updatedOptions);
                        }}
                        disableUnderline={true}
                        sx={{
                            width: "30px",
                            p: 0,
                            m: 0,
                            mb: "4px",
                            '& .MuiInputBase-input': {
                                height: "30px",
                                p: 0,
                            }
                        }}
                    />
                </Box>}
            </>}
        </Box>
    </Box>)
}