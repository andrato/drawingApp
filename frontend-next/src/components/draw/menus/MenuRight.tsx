import { Box, IconButton, IconButtonProps, Typography, useTheme } from "@mui/material";
import { useState, useEffect, useRef, ReactNode } from "react";
import { BoxProps } from "@mui/system";
import { useButtonsRight } from "./useButtonsRight";
import { ActionsMenuRightType, ButtonBodySettings } from "./RightFirstPart";
import { MenuRightLayers } from "./MenuRightLayers";

export const StyledMenuButton = ({
    children, 
    id,
    handleClick,
    width,
    isLayersButton = false,
    ...props
} : {
    children: string, 
    id: string,
    handleClick?: Function,
    isLayersButton?: boolean,
    width: string,
} & BoxProps) => {
    const { getActiveButtonSettings, getActiveButtonLayers } = useButtonsRight();
    const getActiveButtons = isLayersButton ? getActiveButtonLayers : getActiveButtonSettings;
    const theme = useTheme();
    const isSelected = getActiveButtons() === id;

    const border = isSelected ? {
        border: `1px solid ${theme.palette.canvas.menuBtnActive}`,
        borderBottom: "0px",
    } : {
        border: `0.5px solid ${theme.palette.canvas.menuBtnActive}`
    }

    return (<Box 
        {...props}
        id={id} 
        onClick={(e) => handleClick && handleClick(e)}
        sx={(theme) => ({
            width: width,
            backgroundColor: isSelected ? theme.palette.canvas.menuBg : theme.palette.canvas.menuBtnHover,
            ...border,
            borderTop: "0px",
        })}
    >
        <Typography
            sx={(theme) => ({
                color: theme.palette.textCustom.primary,
                textAlign: "center",
                fontSize: theme.customSizes.drawFontSizeMenuText,
                py: "4px",
            })}
        >
            {children}
        </Typography>
    </Box>
)}

export const StyledButton = ({children, ...props}:{children: ReactNode} & IconButtonProps) => (
    <IconButton 
        sx={(theme) => ({
            p: 0,
            color: theme.palette.textCustom.primary,
            ':hover': {
                backgroundColor: theme.palette.canvas.menuBtnHover,
            },
            borderRadius: 0,
            width: "25px",
            ':disabled': {
                color: theme.palette.textCustom.disabled,
            }
        })}
        {...props}
    >
        {children}
    </IconButton>
);

export function MenuRight ({
    actionsMenuRight,
}: {
    actionsMenuRight?: ActionsMenuRightType;
}) {
    const [mouseDown, setMouseDown] = useState(false);
    const [top, setTop] = useState<number>();
    const { setActiveButtonSettings, setActiveButtonLayers, getActiveButtonSettings } = useButtonsRight();
    const buttonsSettings = getActiveButtonSettings();
    const refResize = useRef<any>(null);
    const theme = useTheme();
    const subtract = Number((theme.customSizes.navbarHeight).slice(0, -2)) + 
                    Number((theme.customSizes.drawTopMenuHeight).slice(0, -2)) + 
                    Number((theme.customSizes.drawBorderHeight).slice(0, -2));

    useEffect(() => {
        const elementResize = refResize.current;

        const handleDocumentMouseMove = (event: MouseEvent) => {
            setTop(event.pageY - subtract);
            setMouseDown(true);
        };

        const handleDocumentMouseUp = () => {
            setMouseDown(false);
            document.removeEventListener('mousemove', handleDocumentMouseMove);
            document.removeEventListener('mouseup', handleDocumentMouseUp);
        };

        const handleMouseDown = () => {
            document.addEventListener('mousemove', handleDocumentMouseMove);
            document.addEventListener('mouseup', handleDocumentMouseUp);
        };
      
        elementResize?.addEventListener('mousedown', handleMouseDown);

        return () => {
            elementResize?.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    const handleClickSettings = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setActiveButtonSettings(e.currentTarget.id);
    }
    
    return (<Box 
        sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: mouseDown ? "row-resize" : "auto",
    }}>
        <Box id="firstPart" sx={{
            height: top ? `${top}px` : "50%",
            px: "4px",
        }}>
            <Box sx={{
                display: "flex",
                width: "100%"
            }}>
                <StyledMenuButton 
                    id="settings" 
                    handleClick={handleClickSettings}
                    width="100%"
                >
                    Settings
                </StyledMenuButton>
                
                {/* <StyledMenuButton 
                    id="history" 
                    handleClick={handleClickSettings}
                    width="28%"
                >
                    History
                </StyledMenuButton>

                <StyledMenuButton 
                    id="color" 
                    handleClick={handleClickSettings}
                    width="28%"
                >
                    Color
                </StyledMenuButton> */}
            </Box>
            { buttonsSettings === "settings" && 
                <ButtonBodySettings actionsMenuRight={actionsMenuRight}/>
            }
            {/* { buttonsSettings === "color" && 
                <ColorSettings />
            }
            { buttonsSettings === "history" && 
                <HistorySettings />
            } */}
        </Box>

        <Box 
            ref={refResize}
            sx={(theme) => ({
                width: "inherit",
                height: theme.customSizes.drawBorderHeight,
                backgroundColor: theme.palette.canvas.bgColor,
                cursor: "row-resize",
                zIndex: 2,
                top: mouseDown ? `${top}px` : "",
                position: mouseDown ? "absolute" : "relative",
            })} 
        />

        <Box id="secondPart" sx={{
            width: "100%",
            position: "absolute",
            top: top ? `${top}px` : `50%`,
            bottom: 0,
            minHeight: "100px",
        }}>
            <MenuRightLayers />
        </Box>
        
    </Box >)
}
