import { Box, IconButton, Typography } from "@mui/material";
import { MouseEvent, useState } from "react";
import { AddBoxOutlined, LayersOutlined, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { PropsSettings, StyledButton, StyledMenuButton } from "./MenuRight";
import { NewLayerDialog } from "../utils/NewLayerDialog";
import { CanvasElem } from "../types";
import { publish } from "../events";

export const MenuRightLayers = ({...propsSettings}: PropsSettings) => {
    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState<string | null>(null);
    const [layers, setLayers] = useState<CanvasElem[]>([{
        name: 'Default',
        position: 0,
        selected: true,
        visibility: true,
    }]);

    const handleClick = (selectedLayer: CanvasElem) => {
        const newLayers = layers.map((layer) => ({
            ...layer,
            selected: layer.name === selectedLayer.name ? true : false,
        }));

        setLayers(newLayers);

        const data = [] as CanvasElem[];
        data.push(selectedLayer);

        publish("setLayers", data);
    }

    const handleChange = (name: string) => {
        const newLayer = {
            name: name,
            position: layers.length,
            selected: true,
            visibility: true,
        }

        const newLayers = layers.map((layer) => ({
            ...layer,
            selected: false,
        }));

        newLayers.push(newLayer);
        setLayers(newLayers);

        const data = [] as CanvasElem[];
        data.push(newLayer);

        publish("addLayer", data);
    }

    const handleChangeVisibility = (event: MouseEvent, selectedLayer: CanvasElem) => {
        event.stopPropagation();
        event.preventDefault();

        let newArray = layers.map((layer) => ({
            ...layer,
            ...(layer.name === selectedLayer.name ? {visibility: !selectedLayer.visibility} : {}),
        }));

        setLayers(newArray);
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
            {[...layers].reverse().map((layer) => {
                return <Box 
                    onClick={() => handleClick(layer)}
                    sx={(theme) => ({
                        height: "40px",
                        display: "flex",
                        borderBottom: `1px solid ${theme.palette.canvas.bgColor}`,
                        px: 1,
                        alignItems: "center",
                        justifyContent: "space-between",
                        color: theme.palette.textCustom.primary,
                        backgroundColor: layer.selected ? theme.palette.canvas.menuBtnHover : theme.palette.canvas.menuBg,
                        ":hover": {
                            bgcolor: theme.palette.canvas.menuBtnHover,
                        }
                    })}
                >
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                    }}>
                        <LayersOutlined sx={{
                            mr: 1,
                        }}/>
                        <Typography variant="body2" sx={{fontSize: "12px"}}>{layer.name}</Typography>
                    </Box>
                    <IconButton
                        onClick={(event) => handleChangeVisibility(event, layer)}
                        disabled={layer.name === "Default"}
                        size="small"
                        sx={(theme) => ({
                            color: theme.palette.textCustom.primary,
                            ':disabled': {
                                color: theme.palette.textCustom.disabled,
                            }
                        })}
                    >
                        {layer.visibility ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                    </IconButton>  
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