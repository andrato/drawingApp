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
import { debounce, isEqual } from "lodash";

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
        changeCanvasOrder,
    } = useOnDraw(onDraw);
    const {getActiveButton} = useButtonsLeft();
    // const containerWidth = width + 64; // 16 = container spacing
    // const containerHeight = height + 64; // 16 = container spacing
    const options = useRef<OptionsType>({
        lineWidth: 1,
        opacity: 100,
        color: "#000000",
        sameColorAsLine: false,
        fillColor: "#000000",
        isFillEnabled: false,
    });
    const layers = useRef<CanvasElem[]>([]);

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
        subscribe("newLayerOrder", (event: CustomEvent<CanvasElem[]>) => {
            if(isEqual(layers.current, event.detail)) {
                return;
            }

            layers.current = event.detail;
            changeCanvasOrder(event.detail);
        });

        subscribe("optionSettings", (event: CustomEvent<OptionsType>) => {
            const color = options.current.color;
            options.current = {
                ...event.detail,
                color,
            }
        });

        subscribe("setColor", (event: CustomEvent<string>) => {
            options.current = {
                ...options.current,
                color: event.detail,
            };
        });
    
        return () => {
            unsubscribe("resetLayer", () => {});
            unsubscribe("deleteLayer", () => {});
            unsubscribe("setVisibility", () => {});
            unsubscribe("setLayers", () => {});
            unsubscribe("addLayer", () => {});
            unsubscribe("newLayerOrder", () => {});
            unsubscribe("optionSettings", () => {});
            unsubscribe("setColor", () => {});
        }
    }, []);

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

    /* ******************************s**************************** */
    /*                          DRAW STUFF                        */
    /* ********************************************************** */
    function onDraw(ctx: CanvasRenderingContext2D | null | undefined, coordList: [number,number][], event?: any) {
        if(!ctx) return;

        const {lineWidth, opacity, color} = options.current;

        // set styles        
        switch (getActiveButton()) {
            case 'pencil': 
            case 'pen':
                ctx.globalCompositeOperation="source-over";
                ctx.lineWidth = lineWidth;
                ctx.globalAlpha = opacity / 100;
                ctx.strokeStyle = color;
                ctx.lineCap = 'round';
                break;
            case 'brush':
                ctx.globalCompositeOperation="source-over";
                ctx.lineWidth = getLineWidth(event);
                ctx.globalAlpha = opacity / 100;
                ctx.strokeStyle = color;
                ctx.lineCap = 'round';
                break;
            case 'eraser':
                ctx.globalCompositeOperation="destination-out";
                ctx.lineWidth = lineWidth;
                break;
            // case 'square':
            //     handleDrawSquare(coordList, ctx);
            //     break;
            // case 'circle':
            //     handleDrawCircle(coordList, ctx);
            //     break;
            // default: 
            //     console.log("naspa");
            //     break;
        }

        // access function
        switch (getActiveButton()) {
            case 'pencil': 
            case 'brush':
                handleDrawLine(coordList, ctx);
                break;
            case 'pen':
                break;
            case 'eraser':
                handleDrawLine(coordList, ctx);
                break;
            // case 'square':
            //     handleDrawSquare(coordList, ctx);
            //     break;
            // case 'circle':
            //     handleDrawCircle(coordList, ctx);
            //     break;
            // default: 
            //     console.log("naspa");
            //     break;
        }
    }

    /* function to draw a line */
    // function handleDrawBrush (
    //     start: Point, 
    //     end: Point, 
    //     ctx: CanvasRenderingContext2D | null | undefined,
    //     event?: any,
    // ) {
    //     const {lineWidth, opacity, color} = options.current;

    //     ctx.globalCompositeOperation="source-over";
    //     start = start ?? end;
    //     ctx.beginPath();
    //     ctx.globalAlpha = opacity / 100;
    //     ctx.strokeStyle = 'rgba(0,0,0,0.7)';
    //     ctx.lineJoin = 'round';
    //     ctx.lineCap = 'round';
    //     ctx.moveTo(start.x, start.y);
    //     ctx.lineTo(end.x, end.y);
    //     ctx.stroke(); // we don't want our shape to be filled
    // }

    /* function to draw a line */
    function handleDrawLine (
        coordList: [number,number][],
        ctx: CanvasRenderingContext2D,
    ) {
        if (coordList.length >= 2) {
            ctx.beginPath();
            ctx.moveTo(coordList[0][0], coordList[0][1]);
            for (let i = 1 ; i <  coordList.length ; ++i) {
                ctx.lineTo(coordList[i][0], coordList[i][1]);
            }
            ctx.stroke();
        }
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

        // if (isFillEnabled) { ctx.fill(); }
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
    
