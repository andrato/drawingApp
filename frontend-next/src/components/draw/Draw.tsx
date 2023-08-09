import { ReactNode, createRef, useEffect, useRef, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { 
    HandleActionsCanvasType,
} from "./types";
import { DrawContainer } from "./DrawContainer";
import { MenuLeft } from "./menus/MenuLeft";
import { MenuTop } from "./menus/MenuTop";
import { MenuRight } from "./menus/MenuRight";
import { LocalStorageKeys } from "@/components/utils/constants/LocalStorage";
import { StartingDialog } from "./utils/StartingDialog";
import { useRouter } from "next/router";

const defaultValues = {
    handleClearCanvas: () => {},
    getDrawingVideo: () => {},
    getDrawingImage: () => {},
};

const DrawingContainer = ({children}: {children: ReactNode}) => (
    <Box sx={(theme) => ({
        height: `calc(100% - ${theme.customSizes.navbarHeight})`,
        width: "100%",
        backgroundColor: theme.palette.canvas.bgColor,
    })}>
        {children}
    </Box>
)

export function Draw() {
    const handleActionsCanvas = useRef<HandleActionsCanvasType>(defaultValues);
    const [color, setColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(1);
    const theme = useTheme();
    const subtractHeight = Number((theme.customSizes.drawTopMenuHeight).slice(0,-2)) +
                        Number((theme.customSizes.drawBorderHeight).slice(0,-2)) + "px";
    const [filename, setFilename] = useState<string | null>(null);
    const forceNavigate = useRef<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const warningText =
          'If you leave the page, you will not be able to continue the drawing later. Are you sure do you want to continue?';

        const handleWindowClose = (e: BeforeUnloadEvent) => {
            if (forceNavigate.current) {
                return;
            }
            e.preventDefault();
            return (e.returnValue = warningText);
        };

        const handleBrowseAway = () => {
            if (forceNavigate.current) {
                return;
            }
            if (window.confirm(warningText)) return;
            router.events.emit('routeChangeError');
            throw 'routeChange aborted.';
        };

        window.addEventListener('beforeunload', handleWindowClose);
        router.events.on('routeChangeStart', handleBrowseAway);

        return () => {
            window.removeEventListener('beforeunload', handleWindowClose);
            router.events.off('routeChangeStart', handleBrowseAway);
            localStorage.removeItem(LocalStorageKeys.FILENAME);
            localStorage.removeItem(LocalStorageKeys.DRAWING_ID);
        };
    }, []);

    const setNavigate = (value: boolean) => {
        forceNavigate.current = value;
        router.back();
    }

    /* Functions */
    function setColorForDrawing (color: string) {
        setColor(color);
    }

    if (null === filename) {
        return <DrawingContainer>
            <StartingDialog 
                name={filename} 
                onFilenameChange={(name: string) => {
                    localStorage.setItem(LocalStorageKeys.FILENAME, name);
                    setFilename(name);
                }}
                onClose={() => {
                    setNavigate(true);
                }}
            />
        </DrawingContainer>
    }

    const handleClearCanvas = () => {
        handleActionsCanvas.current.handleClearCanvas();
    }

    const getDrawingVideo = () => {
        return handleActionsCanvas.current.getDrawingVideo();
    }

    const getDrawingImage = () =>{
        return handleActionsCanvas.current.getDrawingImage();
    }

    return (
        <DrawingContainer>
            <Box sx={(theme) => ({
                height: theme.customSizes.drawTopMenuHeight,
                backgroundColor: theme.palette.canvas.menuBg,
                borderBottom: `${theme.customSizes.drawBorderHeight} solid ${theme.palette.canvas.bgColor}`,
                px: "4px",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
            })}>
                <MenuTop 
                    handleClearCanvas={handleClearCanvas} 
                    getDrawingVideo={getDrawingVideo} 
                    getDrawingImage={getDrawingImage}
                    setForceNavigate={setNavigate}
                />
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
                    overflow: "visible",
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
        </DrawingContainer>
    )
}