export type HandleActionsCanvasType = {
    handleClearCanvas: Function,
    getDrawingVideo: Function,
    getDrawingImage: Function,
}

export type CanvasElem = {
    id: string;
    position: number;
    name: string;
    selected: boolean;
    visibility: boolean;
    opacity: number;
}

export type OptionsType = {
    lineWidth: number;
    opacity: number;
    color: string;
    fillColor: string;
    sameColorAsLine: boolean;
    isFillEnabled: boolean;
}

