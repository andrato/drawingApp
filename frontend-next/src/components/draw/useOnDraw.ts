
import { createRef, useCallback, useEffect, useRef } from "react";
import { useButtonsLeft } from "./menus/useButtonsLeft";
import { CanvasRecorder } from "./utils/CanvasRecorder";
import domtoimage from 'dom-to-image-more';

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
    const saveFrames = useRef<any>(null);

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
        
        return canvasRef.current;
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

            // reset values
            isDrawingRef.current = false;
            prevPointRef.current = null;
            pauseRecording();

            // copy from layer aux to current layer
            const buttonActive = getActiveButton();

            const auxCanvas = getRef(0);
            if (auxCanvas !== null && (buttonActive === "circle" || buttonActive === "square")) {
                const ctx = getRef()?.getContext('2d');
                ctx?.drawImage(auxCanvas, 0, 0);
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
    }

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

    function addInitialLayer(ref: HTMLCanvasElement) {
        if (!ref) {
            return;
        }

        const existingElem = refsArray.current.find(elem => ref.isSameNode(elem));

        if (existingElem) {
            return;
        }

        let length = refsArray.current.length + 1;
        refsArray.current = Array(length).fill(null).map((_, i) => refsArray.current[i] || ref);
        canvasRef.current = refsArray.current[refsArray.current.length - 1];

        if (!started && length > 1) {
            const ctx = getRef(1)?.getContext('2d');

            if(!ctx) { return; }

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            started = true;
        }
    }

    function addLayer (id: string) {
        let length = refsArray.current.length + 1;

        /* if we already have an elem with this name => return */
        const elem = document.getElementById(id);
        if (elem !== null) {
            return;
        }

        const newLayer = document.createElement("canvas");
        newLayer.id = id;
        newLayer.width=500;
        newLayer.height=500;
        newLayer.onmousedown=onMouseDown;
        newLayer.style.cssText = `z-index: ${length}; position: absolute; display: inline-block; width: 500px; height: 500px; margin-left: auto; margin-right: auto; left: 0px; right: 0px;`;
        document.getElementById("layersContainers")?.appendChild(newLayer);
        
        canvasRef.current = newLayer;
    }

    function setCurrentLayer (id: string) {
        const elem = document.getElementById(id);

        if (elem === null) {
            return;
        }

        canvasRef.current = elem as HTMLCanvasElement;
    }

    function setVisibility (id: string, visibility: boolean) {
        const layer = document.getElementById(id);

        if (layer === null) {
            return;
        }

        layer.style.display = visibility ? 'inline-block' : 'none';
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

    function deleteLayer() {
        const elem = canvasRef.current;

        if (elem) {
            canvasRef.current = refsArray.current[0];
            elem.remove();

            return true;
        }

        return false;
    }

    function resetLayer() {
        const ref = canvasRef.current;

        const ctx = ref?.getContext('2d');

        if (!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // TODO: not really used => to delete?
    function clearLayer(pos?: number) {
        const ref = getRef(pos);
        const ctx = ref?.getContext('2d');

        if (!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // if (pos === 1) {
        //     ctx.fillStyle = "white";
        //     ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // }
        
        // stopRecording();
    }

    const saveImage = () => {
        if (!videoRef.current) {
            return null;
        }

        const ref = videoRef.current;
        return new Promise(resolve => ref.toBlob(resolve, "image/jpeg"));
    };

    /* ***************************************** */
    /*                Recording                  */
    /* ***************************************** */
    const startRecording = useCallback(() => {
        if(videoRef.current) {
            recorder.createStream(videoRef.current);
            recorder.start();

            const context = videoRef.current.getContext('2d');
            saveFrames.current = setInterval(async () => {
                if (divRef.current) {
                    const canvas = await domtoimage.toCanvas(divRef.current) as HTMLCanvasElement;
                    context?.drawImage(canvas, 0, 0);
                }
            }, 10);
        } else {
            console.error("Smth went wrong")
        }
      }, [])
    
    const stopRecording = useCallback(() => {
        recorder.save();
        recorder.stop();
    }, []);

    const saveRecording = useCallback(() => {
        return recorder.save();
    }, [])

    const pauseRecording = useCallback(() => {
        recorder.pause();
        window && window.clearInterval(saveFrames.current);
    }, [])

    return {
        addLayer, 
        setCurrentLayer,
        addInitialLayer,
        setVisibility,
        deleteLayer,
        resetLayer,
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
