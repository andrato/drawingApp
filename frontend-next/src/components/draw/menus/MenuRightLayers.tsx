import { Box, IconButton, Typography } from "@mui/material";
import { MouseEvent, useEffect, useState } from "react";
import { AddBoxOutlined, DeleteOutline, LayersOutlined, RestartAlt, RestartAltOutlined, VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { StyledButton, StyledMenuButton } from "./MenuRight";
import { NewLayerDialog } from "../utils/NewLayerDialog";
import { CanvasElem } from "../types";
import { publish } from "../events";

export const MenuRightLayers = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState<string | null>(null);
    const [layers, setLayers] = useState<CanvasElem[]>([{
        id: "layers0",
        name: 'default',
        position: 0,
        selected: true,
        visibility: true,
    }]);

    useEffect(() => {
        sessionStorage.setItem("counterLayers", "0");
    }, [])

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
        const index = Number(sessionStorage.getItem("counterLayers")) + 1;
        sessionStorage.setItem("counterLayers", index.toString());

        const newLayer = {
            id: "layers" + index,
            name: name,
            position: index,
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

        publish("setVisibility", [{
            ...selectedLayer,
            visibility: !selectedLayer.visibility,
        }]);
    }

    const handleDeleteCurrentLayer = () => {
        publish("deleteLayer", []);

        const newLayers = layers;
        let updatedLayers = newLayers.filter((layer) => layer.selected ? false : true)

        if (updatedLayers?.length) {
            updatedLayers[0].selected = true;
            setLayers(updatedLayers);
        };
    }

    const handleResetCurrentLayer = () => {
        publish("resetLayer", []);
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
                    key={layer.id}
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
                        <LayersOutlined sx={{mr: 1,}} fontSize="small"/>
                        <Typography variant="body2" sx={{fontSize: "12px"}}>{layer.name}</Typography>
                    </Box>
                    <IconButton
                        onClick={(event) => handleChangeVisibility(event, layer)}
                        disabled={layer.id === "layers0"}
                        size="small"
                        sx={(theme) => ({
                            color: theme.palette.textCustom.primary,
                            ':disabled': {
                                color: theme.palette.textCustom.disabled,
                            }
                        })}
                    >
                        {layer.visibility ? <VisibilityOutlined fontSize="small"/> : <VisibilityOffOutlined fontSize="small"/>}
                    </IconButton>  
                </Box>
            })}
        </Box>
        <Box sx={(theme) => ({
            borderTop: `1px solid ${theme.palette.canvas.bgColor}`,
            height: "25px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            px: 1,
            gap: 2,
        })}>
            <div>
                <StyledButton 
                    onClick={() => setOpen(true)}
                >
                    <AddBoxOutlined fontSize="small"/>
                </StyledButton>
            </div>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                px: 1,
                gap: 1,
            }}>
                <StyledButton 
                    onClick={handleResetCurrentLayer}
                >
                    <RestartAltOutlined fontSize="small" />
                </StyledButton>
                <StyledButton 
                    onClick={handleDeleteCurrentLayer} 
                    disabled={layers[0].selected}
                >
                    <DeleteOutline fontSize="small"/>
                </StyledButton>
            </Box>
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