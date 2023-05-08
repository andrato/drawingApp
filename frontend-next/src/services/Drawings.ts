import { LocalStorageKeys } from "@/components/utils/constants/LocalStorage";
import axios from "axios"

const HOST = "http://localhost:8080/drawing";

export type ErrorType = {
    msg: string;
    param: string;
    [key: string]: string;
}

type FileType = {
    location: string;
    filename: string;
    size: number;
}

export type DrawingType = {
    id: string;
    userId: string;
    userInfo: {
        name: string,
        imgPath: string,
    }
    created: number;
    lastUpdated: number;
    title: string;
    displayTitle: string;
    categories?: string[];
    likes?: number;
    comments?: number;
    topArt?: boolean;
    topAmateur?: boolean;
    video: FileType;
    image: FileType;
    description?: string;
}

export type DrawingTypePartial = {
    id: string,
    created: string,
    displayTitle: string,
    image: FileType,
}


export type DrawingsResponseSuccessType = {
    status: 0;
    drawings: DrawingTypePartial[];
};

export type DrawingResponseSuccessType = {
    status: 0;
    drawing: DrawingType;
};

export type DrawingResponseErrorType = {
    status: 1,
    error?: string,
    errors?: ErrorType[],
};

const config = {
    headers:{
        'Content-Type': 'application/json',
    }
};

export const getDrawings = () => {
    return axios.get<DrawingsResponseSuccessType>(HOST + "/", {...config});
}

export const getDrawingByCategory = (category: string) => {
    if (category === "Gallery") {
        return getDrawings();
    }

    let computedCateg = "topArt";
    if (category === "Top Amateur") {
        computedCateg = "topAmateur";
    }

    return axios.get<DrawingsResponseSuccessType>(HOST + "/category", {...config, params: {category: computedCateg}});
}

export const getDrawing = (id: string) => {
    return axios.get<DrawingResponseSuccessType>(HOST + "/drawing", {...config, params: {drawingId: id}});
}