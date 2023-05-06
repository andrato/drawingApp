import { LocalStorageKeys } from "@/utils/constants/LocalStorage";
import axios from "axios"

const HOST = "http://localhost:8002";

export type ErrorType = {
    msg: string;
    param: string;
    [key: string]: string;
}

export type DrawingResponseSuccessType = {
    status: 0;
    drawingId?: string,
    message: string;
};

export type DrawingResponseErrorType = {
    status: 1,
    drawingId?: string,
    error?: string,
    errors?: ErrorType[],
};

const configMultipart = {
    headers:{
        "Content-Type": "multipart/form-data",
    }
};

const config = {
    headers:{
        'Content-Type': 'application/json',
    }
};

export const postDrawing = (formData: FormData) => {
    const userId = JSON.parse(localStorage.getItem(LocalStorageKeys.USER_INFO) ?? '{"id": "guest"}')?.id;
    const drawingId = localStorage.getItem(LocalStorageKeys.DRAWING_ID) ?? undefined;

    return axios.post<DrawingResponseSuccessType|DrawingResponseErrorType>(HOST + "/save", formData, {...configMultipart, params: {userId: userId, drawingId: drawingId} });
}

export const publishDrawing = (drawing : {
    title: string ; 
    description?: string;
    categories: string[];
}) => {
    const drawingId = localStorage.getItem(LocalStorageKeys.DRAWING_ID) ?? undefined;

    const allData = {...drawing, drawingId};

    return axios.post<DrawingResponseSuccessType|DrawingResponseErrorType>(HOST + "/publish", allData, {...config});
}

export const checkDrawing = (params: {name: string, checkDrawingInProgress?: boolean}) => {
    const userId = JSON.parse(localStorage.getItem(LocalStorageKeys.USER_INFO) ?? '{"id": "guest"}')?.id;

    const drawing = {
        checkDrawingInProgress: true,
        userId, 
        ...params,
    }

    return axios.get<DrawingResponseSuccessType|DrawingResponseErrorType>(HOST + "/check", {...config, params: drawing});
}