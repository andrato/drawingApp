import { Box, Dialog, IconButton, IconButtonProps, Typography, useTheme } from "@mui/material";
import { useState, useEffect, useRef, ReactNode } from "react";
import { BoxProps } from "@mui/system";
import { useButtonsRight } from "./useButtonsRight";
import { ButtonBodySettings, ColorSettings, HistorySettings } from "./RightFirstPart";
import { AddBoxOutlined, LayersClearOutlined, LayersOutlined } from "@mui/icons-material";
// import { add, update } from "../../redux/layersSlice"; 
// import {useDispatch, useSelector} from 'react-redux';
import { PropsSettings, StyledButton, StyledMenuButton } from "./MenuRight";
import { DialogDrawing } from "../utils/DialogDrawing";
import { NewLayerDialog } from "../utils/NewLayerDialog";
import { CanvasElem } from "../types";
import { publish } from "../events";

export const MenuRightLayers = ({...propsSettings}: PropsSettings) => {
    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState<string | null>(null);
    // const layers = useSelector((state: any) => state.layers.value) as CanvasElem[];
    const [layers, setLayers] = useState<CanvasElem[]>([]);
    // const dispatch = useDispatch();

    const handleChange = (name: string) => {
        const newLayer = {
            name: name,
            position: layers.length,
            selected: true,
        }

        const newLayers = layers;
        newLayers.push(newLayer);
        setLayers(newLayers);

        const data = [] as CanvasElem[];
        data.push(newLayer);

        publish("addLayer", data);
    }

    return <>
        <Box sx={{
            display: "flex",
            width: "calc(100% - 8px)",
            mx: "4px",
        }}>
            <StyledMenuButton
                id="layers" 
                width="100%"
                isLayersButton={true}
            >
                Layers
            </StyledMenuButton>
        </Box>
        <Box sx={(theme) => ({
            borderBottom: `1px solid ${theme.palette.canvas.bgColor}`,
            height: "28px",
        })}>
            
        </Box>
        <Box sx={(theme) => ({
            height: "calc(100% - 8px - 73px)",
        })}>
            <Box sx={(theme) => ({
                height: "40px",
                display: "flex",
                borderBottom: `1px solid ${theme.palette.canvas.bgColor}`,
                px: 1,
                alignItems: "center",
                color: theme.palette.textCustom.primary,
                ":hover": {
                    bgcolor: theme.palette.canvas.menuBtnHover,
                }
            })}>
                <LayersOutlined sx={{
                    mr: 1,
                }}/>
                <Typography variant="body2" sx={{fontSize: "12px"}}>Default</Typography>
            </Box>
            {layers.map((layer) => {
                return <Box sx={(theme) => ({
                    height: "40px",
                    display: "flex",
                    borderBottom: `1px solid ${theme.palette.canvas.bgColor}`,
                    px: 1,
                    alignItems: "center",
                    color: theme.palette.textCustom.primary,
                    ":hover": {
                        bgcolor: theme.palette.canvas.menuBtnHover,
                    }
                })}>
                    <LayersOutlined sx={{
                        mr: 1,
                    }}/>
                    <Typography variant="body2" sx={{fontSize: "12px"}}>{layer.name}</Typography>
                </Box>
            })}
        </Box>
        <Box sx={(theme) => ({
            borderTop: `1px solid ${theme.palette.canvas.bgColor}`,
            height: "25px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            px: 1,
        })}>
            <StyledButton onClick={() => setOpen(true)}>
                <AddBoxOutlined />
            </StyledButton>
        </Box>
        <NewLayerDialog
            name={name}
            open={open}
            onHandleChange={handleChange}
            onClose={() => setOpen(false)}
            layers={layers}
        />
    </>
}