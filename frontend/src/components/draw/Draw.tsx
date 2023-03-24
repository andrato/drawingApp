import { useRef, useState } from "react";
import { Box } from "@mui/material";
import { 
    drawColors,
    drawSizes,
    handleActionsCanvasType,
} from "./constants";
import { DrawContainer } from "./DrawContainer";
import { navSizes } from "../header/constants";
import { MenuLeft } from "./menus/MenuLeft";
import { MenuTop } from "./menus/MenuTop";
import { DrawingDialog } from "../../helpers/DrawingDialog";
import { MenuRight } from "./menus/MenuRight";

const defaultValues = {
    handleClearCanvas: () => {},
};

export function Draw() {
    const handleActionsCanvas = useRef<handleActionsCanvasType>(defaultValues);
    const [color, setColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(1);
    const subtractHeight = drawSizes.topMenuHeight + drawSizes.borderHeight + "px";

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

    /* Functions */
    function setColorForDrawing (color: string) {
        setColor(color);
    }

    return (
    <Box sx={{
        height: `calc(100% - ${navSizes.navHeight}px)`,
        width: "100%",
        backgroundColor: `${drawColors.backgroundColor}`
    }}>
        <Box sx={{
            height: `${drawSizes.topMenuHeight}px`,
            backgroundColor: `${drawColors.menusColor}`,
            borderBottom: `${drawSizes.borderHeight}px solid ${drawColors.backgroundColor}`,
            px: "4px",
            display: "flex",
            alignItems: "center",
            flexDirection: "row",
        }}>
            <MenuTop resetDrawing={showDialog} />
        </Box>

        <Box sx={{
            height: `calc(100% - ${subtractHeight})`, 
            display: "flex",
        }}>
            <Box sx={{
                width: `${drawSizes.leftMenuWidth}px`,
                backgroundColor: `${drawColors.menusColor}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: "4px",
                position: "relative",
                zIndex: 1,
            }}>
                <MenuLeft color={color} setColor={setColorForDrawing}/>
            </Box>
            <Box sx={{
                width: `calc(100% - ${drawSizes.leftMenuWidth}px - ${drawSizes.rightMenuWidth}px)`, 
                height: "100%",
                position: "relative",
                overflow: "scroll",
            }}>
                <DrawContainer 
                    width={500} 
                    height={500} 
                    color={color} 
                    lineWidth={lineWidth} 
                    ref={handleActionsCanvas}
                />
            </Box>
            <Box sx={{
                width: `${drawSizes.rightMenuWidth}px`,
                backgroundColor: `${drawColors.menusColor}`,
                zIndex: 1,
            }}>
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