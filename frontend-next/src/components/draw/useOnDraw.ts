import { createRef, useCallback, useEffect, useRef } from "react";
import { useButtonsLeft } from "./menus/useButtonsLeft";
import { CanvasRecorder } from "./utils/CanvasRecorder";
import RecordRTC from "recordrtc";
import { clearInterval } from "timers";
import html2canvas from "html2canvas";

export type Point = {
    x: number,
    y: number,
}

/*
    first ref/canvas => the aux one
    seconds ref/canvas => the main one
*/
export function useOnDraw(onDraw: Function) {
    const refsArray = useRef<HTMLCanvasElement[]>([]);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const isDrawingRef = useRef<boolean> (false);
    const mouseMoveListenerRef = useRef<any>(null);
    const mouseUpListenerRef = useRef<any>(null);
    const prevPointRef = useRef<Point|null>(null);
    const {getActiveButton} = useButtonsLeft();
    const recorder = CanvasRecorder();
    const position = useRef<number>(0);
    let started = false;
    const videoRef = useRef<HTMLCanvasElement | null>(null);
    const divRef = useRef<HTMLDivElement | null>(null);
    const startRecordEvent = useRef<any>(null);
    const stopRecordEvent = useRef<any>(null);
    const eventRecordStarted = new Event('onRecordStarted');
    const eventRecordEnded = new Event('onRecordStopped');
    const saveFrames = useRef<any>(null);

    // let recorder: RecordRTC|null = null;

    // useEffect(() => {
    //     if (canvasRef.current === null && refsArray.current.length > 1) {
    //         canvasRef.current = refsArray.current[1];
    //         const ctx = canvasRef?.current?.getContext('2d');

    //         if(!ctx) { return; }

    //         ctx.fillStyle = "white";
    //         ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    //     }
    // }, [refsArray])

    const getRef = (pos?: number) => {
        if (pos !== undefined && pos <= refsArray.current.length) {
            return refsArray.current[pos];
        }
        return refsArray.current[position.current];
    }

    /* ***************************************** */
    /*                Mouse events               */
    /* ***************************************** */
    function onMouseDown() {
        isDrawingRef.current = true;
        startRecording();
    }

    function initMouseMoveListener() {
        if (!getRef()) return;

        const mouseMoveListener = (e: MouseEvent) => {
            const ref = getRef();
            const refAux = getRef(0);

            if (!isDrawingRef.current) {
                return;
            }
            const point = computePointInCanvas(e.clientX, e.clientY) as Point;
            const ctx = ref?.getContext('2d');
            const ctxAux = refAux?.getContext('2d');
            const buttonActive = getActiveButton();

            if (buttonActive === "circle" || buttonActive === "square") {
                if (prevPointRef.current === null) {
                    prevPointRef.current = point;
                }
                clearLayer(0);
                onDraw(ctxAux, point, prevPointRef.current);
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
            if (!isDrawingRef.current) {
                return;
            }

            window && window.clearInterval(saveFrames.current);

            // reset values
            isDrawingRef.current = false;
            prevPointRef.current = null;
            pauseRecording();

            // copy from layer aux to current layer
            const buttonActive = getActiveButton();

            if (buttonActive === "circle" || buttonActive === "square") {
                const ctx = getRef()?.getContext('2d');
                ctx?.drawImage(getRef(0), 0, 0);
                clearLayer(0);
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
        // if (startRecordEvent.current){
        //     window.removeEventListener("onRecordStarted", startRecordEvent.current);
        // }
        // if (stopRecordEvent.current) {
        //     window.removeEventListener("onRecordEnded", stopRecordEvent.current);
        // }
    }

    // function initRecordEvents() {
    //     let saveFrames: any;

    //     const recordOnCanvas = () => {
    //         // Draw the contents of the div onto the canvas every 100ms
    //         console.log("sunt pe start");
    //         const context = videoRef.current?.getContext('2d');

    //         saveFrames = setInterval(function() {
    //             console.log("sunt in interval");
    //             // divRef.current && context?.drawImage(divRef.current as CanvasImageSource, 0, 0);
    //         }, 1000);
    //     }

    //     const clearRecordInterval = () => {
    //         console.log("sunt pe stop");
    //         // clearInterval(saveFrames);
    //     }

    //     startRecordEvent.current = recordOnCanvas();
    //     stopRecordEvent.current = clearRecordInterval();

    //     window.addEventListener('onRecordStarted', startRecordEvent.current);
    //     window.addEventListener('onRecordEnded', stopRecordEvent.current);

    // }

    /* ***************************************** */
    /*            IMPORTANT FUNCTIONS            */
    /* ***************************************** */
    useEffect(() => {
        initMouseUpListener();
        initMouseMoveListener();
        // initRecordEvents();

        return () => {
            // remove the listeners
            removeListeners();
        }
    }, [onDraw])

    function addLayer(ref: HTMLCanvasElement) {
        if (!ref) {
            return;
        }

        const existingElem = refsArray.current.find(elem => ref.isSameNode(elem));

        if (existingElem) {
            return;
        }

        let length = refsArray.current.length + 1;
        refsArray.current = Array(length).fill(null).map((_, i) => refsArray.current[i] || ref);
        position.current = length-1;

        if (!started && length > 1) {
            const ctx = getRef(1)?.getContext('2d');

            if(!ctx) { return; }

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            started = true;
        }
    }

    const setVideoRef = (ref: HTMLCanvasElement) => {
        videoRef.current = ref;
    }

    const setDivRef = (ref: HTMLDivElement) => {
        divRef.current = ref;
    }

    /* ***************************************** */
    /*                  HELPERS                  */
    /* ***************************************** */
    /* helper to consider the (0,0) point where the canvas starts */
    function computePointInCanvas(clientX: number, clientY: number) {
        const ref = getRef();
        if(!ref) return null;

        const boundingRect = ref.getBoundingClientRect();

        return {
            x: clientX - boundingRect.left,
            y: clientY - boundingRect.top,   
        }
    }

    function eraseAll() {
        canvasRef.current = null;
        refsArray.current = Array(2).fill(null).map((_, i) => refsArray.current[i] || createRef());
        stopRecording();
    }

    function clearLayer(pos?: number) {
        const ref = getRef(pos);
        const ctx = ref.getContext('2d');

        if (!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // if (pos === 1) {
        //     ctx.fillStyle = "white";
        //     ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // }
        
        stopRecording();
    }

    const saveImage = () => {
        const ref = refsArray.current[1];
        return new Promise(resolve => ref.toBlob(resolve, "image/jpeg"));
    };

    /* ***************************************** */
    /*                Recording                  */
    /* ***************************************** */
    const startRecording = () => {
        if(videoRef.current) {
            recorder.createStream(videoRef.current);
            recorder.start();
            // divRef.current?.dispatchEvent(eventRecordStarted);
            // recorder = new RecordRTC(videoRef.current, {type: "video"});
            // recorder.startRecording();

            const context = videoRef.current.getContext('2d');
            saveFrames.current = setInterval(async () => {
                context?.drawImage(getRef(), 0, 0);
            }, 100);
        } else {
            console.error("naspa")
        }
    }
    
    const stopRecording = () => {
        recorder.save();
        recorder.stop();
        // divRef.current?.dispatchEvent(eventRecordEnded);
        // recorder?.stopRecording();
    }

    const saveRecording = () => {
        return recorder?.save();
        // const ceva = recorder?.getBlob();
        // return ceva;
    }

    const pauseRecording = () => {
        recorder.pause();
        // recorder?.pauseRecording();
    }

    return {
        addLayer, 
        onMouseDown,
        clearLayer,
        startRecording,
        stopRecording,
        saveRecording,
        saveImage,
        setVideoRef,
        setDivRef,
    };
}