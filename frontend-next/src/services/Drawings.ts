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

const config = {
    headers:{
        "Content-Type": "multipart/form-data",
    }
};

export const getDrawing = (id: string) => {
    // return axios.get<DrawingResponseSuccessType | DrawingResponseErrorType>(HOST + "signin", {...config, params: user});  
}

export const postDrawing = (formData: FormData) => {
    const userId = JSON.parse(localStorage.getItem(LocalStorageKeys.USER_INFO) ?? '{"userId": "guest"}')?.id;

    console.log("userId: " + userId);
    return axios.post<DrawingResponseSuccessType|DrawingResponseErrorType>(HOST + "save", formData, {...config, params: {userId: userId} });
}