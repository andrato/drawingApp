import { useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { 
    handleActionsCanvasType,
} from "./types";
import { DrawContainer } from "./DrawContainer";
import { MenuLeft } from "./menus/MenuLeft";
import { MenuTop } from "./menus/MenuTop";
import { MenuRight } from "./menus/MenuRight";
import { DrawingDialog } from "@/utils/helpers/DrawingDialog";
import { postDrawing } from "@/services/Drawings";

const defaultValues = {
    handleClearCanvas: () => {},
    getDrawingVideo: () => {},
    getDrawingImage: () => {},
};

export function Draw() {
    const handleActionsCanvas = useRef<handleActionsCanvasType>(defaultValues);
    const [color, setColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(1);
    const theme = useTheme();
    const subtractHeight = Number((theme.customSizes.drawTopMenuHeight).slice(0,-2)) +
                        Number((theme.customSizes.drawBorderHeight).slice(0,-2)) + "px";

    /* Dialog stuff */
    const [open, setOpen] = useState(false);
    const dialogTitleReset = "Are you sure you want to start over?";
    const dialogDescriptionReset = "Once you 'Agree' with this, all your work will be lost. Please make sure you know what you are doing!";
 
    function showDialog() {
        setOpen(true);
    }

    function closeDialog() {
        setOpen(false);
    } 

    function resetDrawing() {
        console.log("resetDrawing");
        setOpen(false);
        handleActionsCanvas.current.handleClearCanvas();
    }

    async function saveDrawing() {
        const name = "ceva";
        const drawingVideoFile = handleActionsCanvas.current.getDrawingVideo();
        const drawingImageFile = await handleActionsCanvas.current.getDrawingImage();

        if (!drawingVideoFile) {
            console.log("video e null");
            return;
        }

        console.log(drawingImageFile);

        // we have the videoFile => send it to backend
        const formData = new FormData();
        formData.append('files', drawingVideoFile, name);
        formData.append('files', drawingImageFile, name);
        postDrawing(formData);
    }

    /* Functions */
    function setColorForDrawing (color: string) {
        setColor(color);
    }

    return (
    <Box sx={(theme) => ({
        height: `calc(100% - ${theme.customSizes.navbarHeight})`,
        width: "100%",
        backgroundColor: theme.palette.canvas.bgColor,
    })}>
        <Box sx={(theme) => ({
            height: theme.customSizes.drawTopMenuHeight,
            backgroundColor: theme.palette.canvas.menuBg,
            borderBottom: `${theme.customSizes.drawBorderHeight} solid ${theme.palette.canvas.bgColor}`,
            px: "4px",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
        })}>
            <MenuTop resetDrawing={showDialog} saveDrawing={saveDrawing} />
        </Box>

        <Box sx={{
            height: `calc(100% - ${subtractHeight})`, 
            display: "flex",
        }}>
            <Box sx={(theme) => ({
                width: theme.customSizes.drawLeftMenuWidth,
                backgroundColor: theme.palette.canvas.menuBg,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: "4px",
                position: "relative",
                zIndex: 1,
            })}>
                <MenuLeft color={color} setColor={setColorForDrawing}/>
            </Box>
            <Box sx={(theme) => ({
                width: `calc(100% - ${theme.customSizes.drawLeftMenuWidth} - ${theme.customSizes.drawRightMenuWidth})`, 
                height: "100%",
                position: "relative",
                overflow: "scroll",
            })}>
                <DrawContainer 
                    width={500} 
                    height={500} 
                    color={color} 
                    lineWidth={lineWidth} 
                    ref={handleActionsCanvas}
                />
            </Box>
            <Box sx={(theme) => ({
                width: theme.customSizes.drawRightMenuWidth,
                backgroundColor: theme.palette.canvas.menuBg,
                zIndex: 1,
            })}>
                <MenuRight setLineWidth={setLineWidth}/>
            </Box>
        </Box>

        <DrawingDialog
            open={open} 
            title={dialogTitleReset} 
            description={dialogDescriptionReset} 
            onClose={closeDialog} 
            actionHandler={resetDrawing}
        /> 
    </Box>
    )
}