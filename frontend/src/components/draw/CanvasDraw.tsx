import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { useOnDraw, Point } from "./useOnDraw";
import { Box } from "@mui/material";
import { useButtonsLeft } from "./menus/useButtonsLeft";
import { 
    handleActionsCanvasType,
} from "./constants";
import { CanvasRecorder } from "./utils/CanvasRecorder";

export type CanvasProps = {
    color: string, 
    lineWidth: number, 
    width: number, 
    height: number
  }

export const CanvasDraw = forwardRef((props: CanvasProps, ref: React.Ref<handleActionsCanvasType>) => {
    /* ********************************************************** */
    /*                           VARIABLES                        */
    /* ********************************************************** */
    /* Canvas stuff */
    const {width, height, color, lineWidth} = props;
    const {setCanvasRef, onMouseDown, clearCanvas, startRecording, stopRecording} = useOnDraw(onDraw);
    const {getActiveButton} = useButtonsLeft();
    const containerWidth = width + 64; // 16 = container spacing
    const containerHeight = height + 64; // 16 = container spacing

    /* ***************************************** */
    /*                Recording                  */
    /* ***************************************** */

    useEffect(() => {
        startRecording();
        
        return () => {
            stopRecording();
        }
    },[]);

    useImperativeHandle(ref, () => ({
        handleClearCanvas() {
            clearCanvas();
            stopRecording();
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
        if(!ctx) return;

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.rect(start.x, start.y, end.x-start.x, end.y-start.y);
        ctx.stroke();
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
        <Box sx={{
            position: "absolute",
            width: `max(100%, ${containerWidth}px)`,
            height: `max(100%, ${containerHeight}px)`,
            display: "grid",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <canvas 
                ref={setCanvasRef} 
                height={height}
                width={width}
                onMouseDown={onMouseDown}
                style={{
                    display: "inline-block", 
                    backgroundColor: "white",
                    width: `${width}px`,
                    height: `${height}px`,
                }}
            />
        </Box>
    )
})
    