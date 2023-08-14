import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useOnDraw, Point } from "./useOnDraw";
import { Box } from "@mui/material";
import { useButtonsLeft } from "./menus/useButtonsLeft";
import { 
    CanvasElem,
    HandleActionsCanvasType,
} from "./types";
import { subscribe, unsubscribe } from "./events";

export type CanvasProps = {
    color: string, 
    lineWidth: number, 
    width: number, 
    height: number,
}

const defaulName = "Default";

const startingLayers: CanvasElem[] = []

export const CanvasDraw = forwardRef((props: CanvasProps, ref: React.Ref<HandleActionsCanvasType>) => {
    /* ********************************************************** */
    /*                           VARIABLES                        */
    /* ********************************************************** */
    /* Canvas stuff */
    const {width, height, color, lineWidth} = props;
    const {
        saveRecording, 
        saveImage, 
        onMouseDown, 
        addLayer, 
        addInitialLayer, 
        setVideoRef, 
        setDivRef,
        setCurrentLayer
    } = useOnDraw(onDraw);
    const {getActiveButton} = useButtonsLeft();
    const containerWidth = width + 64; // 16 = container spacing
    const containerHeight = height + 64; // 16 = container spacing
    // for layers
    const newLayers = useRef<CanvasElem[]>([{
        id: "layers0",
        name: 'Default',
        position: 0,
        selected: true,
        visibility: true,
    }]);

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

    useEffect(() => {
        subscribe("setLayers", (event: CustomEvent<CanvasElem[]>) => {
            console.log("in event");
            const layer = event.detail[0];

            const elem = newLayers.current.find((elem) => elem.id === layer.id);

            if(!elem) {
                console.error("Layer not found");

                return;
            }

            setCurrentLayer(layer.position);
        });
        subscribe("addLayer", (event: CustomEvent<CanvasElem[]>) => {
            console.log("in event");
            const elem = newLayers.current.find((elem) => elem.id === event.detail[0].id);

            if(elem) {
                return;
            }

            newLayers.current.push(event.detail[0]);
            addLayer(event.detail[0].id);
        });
    
        return () => {
          unsubscribe("setLayers", () => {});
          unsubscribe("addLayer", () => {});
        }
      }, []);

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
        <Box id="ceva" sx={{
            position: "absolute",
            width: `max(100%, ${containerWidth}px)`,
            height: `max(100%, ${containerHeight}px)`,
            display: "grid",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Box 
                id="layersContainers"
                height={height}
                width={width}
                ref={setDivRef}
                sx={{    
                    position: "absolute", 
                    // width: `${width}px`,
                    // height: `${height}px`,
                    marginLeft: "auto",
                    marginRight: "auto",
                    left: 0,
                    right: 0,
                }}
            >
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
                    ref={addInitialLayer} 
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
                    id="layers0"
                    ref={addInitialLayer} 
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
    
