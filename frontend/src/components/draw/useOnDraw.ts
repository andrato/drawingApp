import { useEffect, useRef } from "react";
import { useButtonsLeft } from "./menus/useButtonsLeft";

export type Point = {
    x: number,
    y: number,
}

export function useOnDraw(onDraw: Function) {
    const canvasRef = useRef<HTMLCanvasElement|null>(null);
    const isDrawingRef = useRef<boolean> (false);
    const mouseMoveListenerRef = useRef<any>(null);
    const mouseUpListenerRef = useRef<any>(null);
    const prevPointRef = useRef<Point|null>(null);
    const {getActiveButton} = useButtonsLeft();

    /* ***************************************** */
    /*                Mouse events               */
    /* ***************************************** */
    function onMouseDown() {
        isDrawingRef.current = true;
    }

    function initMouseMoveListener() {
        if (!canvasRef.current) return;

        const mouseMoveListener = (e: MouseEvent) => {
            if (!isDrawingRef.current) return;
            const point = computePointInCanvas(e.clientX, e.clientY) as Point;
            const ctx = canvasRef?.current?.getContext('2d');
            const buttonActive = getActiveButton();

            if (buttonActive === "circle" || buttonActive === "square") {
                if (prevPointRef.current === null) {
                    prevPointRef.current = point;
                }
                clearCanvas();
                onDraw(ctx, point, prevPointRef.current);
            } else {
                onDraw(ctx, point, prevPointRef.current);
                prevPointRef.current = point;
            }
        }

        mouseMoveListenerRef.current = mouseMoveListener;
        window.addEventListener<"mousemove">("mousemove", mouseMoveListener);
    }

    function initMouseUpListener() {
        const mouseUpListener = () => {
            isDrawingRef.current = false;

            prevPointRef.current = null;
        }

        mouseUpListenerRef.current = mouseUpListener;
        window.addEventListener<"mouseup">("mouseup", mouseUpListener);
    }

    function removeListeners() {
        if (mouseMoveListenerRef.current) {
            window.removeEventListener("mousemove", mouseMoveListenerRef.current);
        }
        if (mouseUpListenerRef.current) {
            window.removeEventListener("mouseup", mouseUpListenerRef.current);
        }
    }

    /* ***************************************** */
    /*            IMPORTANT FUNCTIONS            */
    /* ***************************************** */
    useEffect(() => {
        initMouseUpListener();
        initMouseMoveListener();

        return () => {
            // remove the listeners
            removeListeners();
        }
    }, [onDraw])

    function setCanvasRef(ref: HTMLCanvasElement) {
        canvasRef.current = ref;
    }

    /* ***************************************** */
    /*                  HELPERS                  */
    /* ***************************************** */
    /* helper to consider the (0,0) point where the canvas starts */
    function computePointInCanvas(clientX: number, clientY: number) {
        if(!canvasRef.current) return null;

        const boundingRect = canvasRef.current.getBoundingClientRect();

        return {
            x: clientX - boundingRect.left,
            y: clientY - boundingRect.top,   
        }
    }

    function clearCanvas() {
        const ctx = canvasRef?.current?.getContext('2d');

        if (!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }

    return {
        setCanvasRef, 
        onMouseDown,
        clearCanvas
    };
}