import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useOnDraw, Point } from "./useOnDraw";
import { Box } from "@mui/material";
import { useButtonsLeft } from "./menus/useButtonsLeft";
import { 
    CanvasElem,
    HandleActionsCanvasType,
    OptionsType,
} from "./types";
import { publish, subscribe, unsubscribe } from "./events";
import { SessionStorageVars } from "./menus/utils";

export type CanvasProps = {
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
    const {width, height} = props;
    const {
        saveRecording, 
        saveImage, 
        onMouseDown, 
        addLayer, 
        addInitialLayer, 
        setVideoRef, 
        setDivRef,
        setCurrentLayer,
        setVisibility,
        deleteLayer,
        resetLayer,
    } = useOnDraw(onDraw);
    const {getActiveButton} = useButtonsLeft();
    const containerWidth = width + 64; // 16 = container spacing
    const containerHeight = height + 64; // 16 = container spacing
    const options = useRef<OptionsType>({
        lineWidth: 1,
        opacity: 100,
        color: "#000000",
        sameColorAsLine: false,
        fillColor: "#000000",
        isFillEnabled: false,
    });

    /* ***************************************** */
    /*                For parent                 */
    /* ***************************************** */
    useImperativeHandle(ref, () => ({
        handleClearCanvas() {
            // clearCanvas();
        },

        getDrawingVideo () {
            return saveRecording();
        },

        getDrawingImage() {
            return saveImage();
        },
    }));

    useEffect(() => {
        subscribe("deleteLayer", (event: CustomEvent<CanvasElem[]>) => {
            deleteLayer();
        });
        subscribe("resetLayer", (event: CustomEvent<CanvasElem[]>) => {
            resetLayer();
        });

        subscribe("setVisibility", (event: CustomEvent<CanvasElem[]>) => {
            const layer = event.detail[0];

            setVisibility(layer.id, layer.visibility);
        });
        subscribe("setLayers", (event: CustomEvent<CanvasElem[]>) => {
            const layer = event.detail[0];

            setCurrentLayer(layer.id);
        });
        subscribe("addLayer", (event: CustomEvent<CanvasElem[]>) => {
            addLayer(event.detail[0].id);
        });

        subscribe("optionSettings", (event: CustomEvent<OptionsType>) => {
            options.current = event.detail;
        });
    
        return () => {
            unsubscribe("resetLayer", () => {});
            unsubscribe("deleteLayer", () => {});
            unsubscribe("setVisibility", () => {});
            unsubscribe("setLayers", () => {});
            unsubscribe("addLayer", () => {});
            unsubscribe("optionSettings", () => {});
        }
      }, []);

    /* ******************************s**************************** */
    /*                          DRAW STUFF                        */
    /* ********************************************************** */
    function onDraw(ctx: CanvasRenderingContext2D | null | undefined, point: Point, prevPoint: Point, event?: any) {
        switch (getActiveButton()) {
            case 'pencil': 
                handleDrawLine(prevPoint, point, ctx);
                break;
            case 'brush':
                handleDrawBrush(prevPoint, point, ctx, event);
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

    const getProps = () => {
        const lineWidth = Number(sessionStorage.getItem(SessionStorageVars.LINE_WIDTH) ?? 1);
        const opacity = Number(sessionStorage.getItem(SessionStorageVars.OPACITY) ?? 100);
        const color = sessionStorage.getItem(SessionStorageVars.LINE_COLOR) ?? "#000000";
        const fillColor = sessionStorage.getItem(SessionStorageVars.FILL_SHAPE_COLOR);
        const sameColorAsLine = Boolean(sessionStorage.getItem(SessionStorageVars.IS_SAME_COLOR));

        return {
            lineWidth,
            opacity,
            color,
            fillColor,
            sameColorAsLine,
        }
    }

    const getLineWidth = (e: any) => {
        const {lineWidth} = options.current;

        return (e.pressure) ? (e.pressure * lineWidth) : lineWidth;
        // switch (e.pointerType) {
        //     case 'touch': {
        //         if (e.width < 10 && e.height < 10) {
        //             return (e.width + e.height) * 2 + 10;
        //         } else {
        //             return (e.width + e.height - 40) / 2;
        //         }
        //     }
        //     case 'pen': 
        //         return e.pressure * 8;
        //     default: 
        //         return (e.pressure) ? e.pressure * 8 : 4;
        // }
      }

    /* function to draw a line */
    function handleDrawBrush (
        start: Point, 
        end: Point, 
        ctx: CanvasRenderingContext2D | null | undefined,
        event?: any,
    ) {
        if(!ctx) return;

        const {lineWidth, opacity, color} = options.current;

        ctx.globalCompositeOperation="source-over";
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = getLineWidth(event);
        ctx.globalAlpha = opacity / 100;
        ctx.strokeStyle = color;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke(); // we don't want our shape to be filled
    }

    /* function to draw a line */
    function handleDrawLine (
        start: Point, 
        end: Point, 
        ctx: CanvasRenderingContext2D | null | undefined,
    ) {
        if(!ctx) return;

        const {lineWidth, opacity, color} = options.current;

        ctx.globalCompositeOperation="source-over";
        start = start ?? end;
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = opacity / 100;
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

        const {lineWidth} = options.current;

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

        const {lineWidth, color, fillColor, sameColorAsLine, isFillEnabled} = options.current;

        const shapeColor = sameColorAsLine ? color : fillColor;

        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        if (isFillEnabled) { ctx.fillStyle = shapeColor; }
        ctx.beginPath();
        ctx.rect(start.x, start.y, end.x-start.x, end.y-start.y);
        ctx.stroke();
        if (isFillEnabled) { ctx.fill(); }
    }

    function handleDrawCircle (
        start: Point, 
        end: Point, 
        ctx: CanvasRenderingContext2D | null | undefined,
    ) {
        if(!ctx) return;

        const {lineWidth, color, fillColor, sameColorAsLine, isFillEnabled} = options.current;

        const shapeColor = sameColorAsLine ? color : fillColor;

        ctx.globalCompositeOperation = "copy";
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        if (isFillEnabled) { ctx.fillStyle = shapeColor; }
        ctx.beginPath();
        // ctx.arc(start.x, start.y, Math.abs(start.x-end.x), 0, 2 * Math.PI, true) // tb optiune si pt cerc
        ctx.ellipse(start.x, start.y, Math.abs(start.x-end.x), Math.abs(start.y-end.y), 0, 0, 2 * Math.PI);
        ctx.stroke();
        if (isFillEnabled) { ctx.fill(); }
    }

    /* ********************************************************** */
    /*                          THE RETURN                        */
    /* ********************************************************** */
    return (
        <Box id="ceva" sx={{
            position: "absolute",
            width: `max(100%, ${width}px)`,
            height: `max(100%, ${height}px)`,
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
                        zIndex: 100,
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
    
