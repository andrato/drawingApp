import { useCallback, useEffect, useRef } from "react";
import { useButtonsLeft } from "./menus/useButtonsLeft";
import { CanvasRecorder } from "./utils/CanvasRecorder";

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
    const recorder = CanvasRecorder();

    useEffect(() => {
        const ctx = canvasRef?.current?.getContext('2d');

        if(!ctx) { return; }

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }, [canvasRef])

    /* ***************************************** */
    /*                Recording                  */
    /* ***************************************** */
    const startRecording = useCallback(() => {
        if(canvasRef.current) {
            console.log("starting recording")
            recorder.createStream(canvasRef.current);
            recorder.start();
        } else {
            console.error("naspa")
        }
      }, [canvasRef])
    
    const stopRecording = useCallback(() => {
        console.log("stopped recording");
        recorder.save("ceva");
        recorder.stop();
    }, []);

    const saveRecording = useCallback(() => {
        return recorder.save("intermediar");
    }, [])

    const pauseRecording = useCallback(() => {
        recorder.pause();
    }, [])


    /* ***************************************** */
    /*                Mouse events               */
    /* ***************************************** */
    function onMouseDown() {
        isDrawingRef.current = true;
        startRecording();
    }

    function initMouseMoveListener() {
        if (!canvasRef.current) return;

        const mouseMoveListener = (e: MouseEvent) => {
            if (!isDrawingRef.current) {
                return;
            }
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
            if (isDrawingRef.current) {
                isDrawingRef.current = false;
                prevPointRef.current = null;
                pauseRecording();
            }
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

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        stopRecording();
    }

    return {
        setCanvasRef, 
        onMouseDown,
        clearCanvas,
        startRecording,
        stopRecording,
        saveRecording,
    };
}