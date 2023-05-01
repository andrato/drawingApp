import { LocalStorageKeys } from "@/utils/constants/LocalStorage";
import axios from "axios"

const HOST = "http://localhost:3002/";

type ErrorType = {
    msg: string;
    param: string;
    [key: string]: string;
}

type DrawingResponseSuccessType = {
    status: 0;
    message: string;
};
type DrawingResponseErrorType = {
    status: 1,
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

    return axios.post<DrawingResponseSuccessType|DrawingResponseErrorType>(HOST + "save", formData, {...configMultipart, params: {userId: userId} });
}

export const publishDrawing = (drawing : {
    title: string ; 
    previousTitle: string;
    description?: string;
    categories: string[];
}) => {
    const userId = JSON.parse(localStorage.getItem(LocalStorageKeys.USER_INFO) ?? '{"id": "guest"}')?.id;

    const allData = {...drawing, userId};

    return axios.post<DrawingResponseSuccessType|DrawingResponseErrorType>(HOST + "publish", allData, {...config});
}

export const checkDrawing = (userId: string, name: string) => {
    const drawing = {
        userId, 
        name,
    }

    return axios.get<DrawingResponseSuccessType|DrawingResponseErrorType>(HOST + "check", {...config, params: drawing});
}

export const getDrawing = (id: string) => {
    // return axios.get<DrawingResponseSuccessType | DrawingResponseErrorType>(HOST + "signin", {...config, params: user});  
}