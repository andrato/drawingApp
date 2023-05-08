import { LocalStorageKeys } from "@/components/utils/constants/LocalStorage";
import axios from "axios"

const HOST = "http://localhost:8080/progress";

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
    displayTitle: string;
    description?: string;
    categories: string[];
}) => {
    const drawingId = localStorage.getItem(LocalStorageKeys.DRAWING_ID) ?? undefined;
    const user = JSON.parse(localStorage.getItem(LocalStorageKeys.USER_INFO) ?? '{"id": "guest"}');

    const allData = {
        ...drawing, 
        drawingId, 
        userName: user?.name ?? "",
        userImg: user?.name ?? "",
    };

    return axios.post<DrawingResponseSuccessType|DrawingResponseErrorType>(HOST + "/publish", allData, {...config});
}

export const checkDrawing = (params: {name: string, checkDrawingInProgress?: boolean}) => {
    const userId = JSON.parse(localStorage.getItem(LocalStorageKeys.USER_INFO) ?? '{"id": "guest"}').id;

    const drawing = {
        checkDrawingInProgress: true,
        userId,
    }

    return axios.get<DrawingResponseSuccessType|DrawingResponseErrorType>(HOST + "/check", {...config, params: drawing});
}