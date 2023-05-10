import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useOnDraw, Point } from "./useOnDraw";
import { Box } from "@mui/material";
import { useButtonsLeft } from "./menus/useButtonsLeft";
import { 
    HandleActionsCanvasType,
} from "./types";

export type CanvasProps = {
    color: string, 
    lineWidth: number, 
    width: number, 
    height: number,
}

type CanvasElem = {
    name: string | null,
}

const startingLayers: CanvasElem[] = [{
    name: "Default",
}, {
    name: null
}]

export const CanvasDraw = forwardRef((props: CanvasProps, ref: React.Ref<HandleActionsCanvasType>) => {
    /* ********************************************************** */
    /*                           VARIABLES                        */
    /* ********************************************************** */
    /* Canvas stuff */
    const {width, height, color, lineWidth} = props;
    // const canvases = useState<CanvasElem[]>(startingLayers);
    const {saveRecording, saveImage, onMouseDown, addLayer, setVideoRef, setDivRef} = useOnDraw(onDraw);
    const {getActiveButton} = useButtonsLeft();
    const containerWidth = width + 64; // 16 = container spacing
    const containerHeight = height + 64; // 16 = container spacing

    // useEffect(() => {
    //     setLayers()
    // }, []);

    /* ***************************************** */
    /*                For parent                 */
    /* ***************************************** */
    useImperativeHandle(ref, () => ({
        handleClearCanvas() {
            // clearCanvas();
        },

        getDrawingVideo () {
            const ceva = saveRecording();
            return ceva;

        },

        getDrawingImage() {
            return saveImage();
        },
    }));

    /* ******************************s**************************** */
    /*                          DRAW STUFF                        */
    /* ********************************************************** */
    function onDraw(ctx: CanvasRenderingContext2D | null | undefined, point: Point, prevPoint: Point ) {
        switch (getActiveButton()) {
            case 'pencil': 
                handleDrawLine(prevPoint, point, ctx);
                break;
            case 'brush':
                break;
            case 'pen':
                break;
            case 'eraser':
                handleEraser(prevPoint, point, ctx);
                break;
            case 'square':
                handleDrawSquare(prevPoint, point, ctx);
                break;
            case 'circle':
                handleDrawCircle(prevPoint, point, ctx);
                break;
            default: 
                console.log("naspa");
                break;
        }
    }

    /* function to draw a line */
    function handleDrawLine (
        start: Point, 
        end: Point, 
        ctx: CanvasRenderingContext2D | null | undefined,
    ) {
        if(!ctx) return;

        ctx.globalCompositeOperation="source-over";
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineCap = 'round';
        ctx.stroke(); // we don't want our shape to be filled
    }

    /* eraser */
    function handleEraser (
        start: Point, 
        end: Point, 
        ctx: CanvasRenderingContext2D | null | undefined,
    ) {
        if(!ctx) return;

        ctx.globalCompositeOperation="destination-out";
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineCap = 'round';
        ctx.stroke(); // we don't want our shape to be filled
    }

    function handleDrawSquare (
        start: Point, 
        end: Point, 
        ctx: CanvasRenderingContext2D | null | undefined,
    ) {

        // if(!ctx) return;

        // ctx.lineWidth = lineWidth;
        // ctx.strokeStyle = color;
        // ctx.beginPath();
        // ctx.rect(start.x, start.y, end.x-start.x, end.y-start.y);
        // ctx.stroke();
    }

    function handleDrawCircle (
        start: Point, 
        end: Point, 
        ctx: CanvasRenderingContext2D | null | undefined,
    ) {
        if(!ctx) return;

        ctx.globalCompositeOperation = "copy";
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.beginPath();
        // ctx.arc(start.x, start.y, Math.abs(start.x-end.x), 0, 2 * Math.PI, true) // tb optiune si pt cerc
        ctx.ellipse(start.x, start.y, Math.abs(start.x-end.x), Math.abs(start.y-end.y), 0, 0, 2 * Math.PI)

        ctx.stroke();
    }


    /* ********************************************************** */
    /*                          THE RETURN                        */
    /* ********************************************************** */
    return (
        <Box id="ceva" sx={{
            position: "absolute",
            width: `max(100%, ${containerWidth}px)`,
            height: `max(100%, ${containerHeight}px)`,
            display: "grid",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Box sx={{
                position: "absolute", 
                width: `${width}px`,
                height: `${height}px`,
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
            }}>
                <canvas 
                    ref={setVideoRef}
                    height={height}
                    width={width}
                    style={{
                        display: "none",
                        width: `${width}px`,
                        height: `${height}px`,
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                    }}
                />
                <canvas 
                    ref={addLayer} 
                    height={height}
                    width={width}
                    onMouseDown={onMouseDown}
                    style={{
                        zIndex: 2,
                        display: "inline-block",
                        position: "absolute", 
                        width: `${width}px`,
                        height: `${height}px`,
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                    }}
                />
                <canvas 
                    ref={addLayer} 
                    height={height}
                    width={width}
                    onMouseDown={onMouseDown}
                    style={{
                        zIndex: 1,
                        position: "absolute", 
                        display: "inline-block", 
                        backgroundColor: "white",
                        width: `${width}px`,
                        height: `${height}px`,
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                    }}
                />       
            </Box>
        </Box>
    )
})
    