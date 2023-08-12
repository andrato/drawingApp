import { Category } from "@/components/profile/helpers";
import axios from "axios"

export const HOST = "http://localhost:8080/drawing";
export const HOST_DRAWINGS = HOST + "/";
export const HOST_DRAWINGS_ADMIN = HOST + "/getAdmin";
export const HOST_DRAWING = HOST + "/drawing";
export const HOST_USER_DRAWINGS = HOST + "/user";
export const HOST_CATEGORY_DRAWINGS = HOST + "/";

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
    labels?: string[];
    reviews?: number;
    rating?: number;
    topArt?: boolean;
    topAmateur?: boolean;
    video: FileType;
    image: FileType;
    description?: string;
}

export type DrawingAdminType = {
    id: string;
    userId: string;
    created: number;
    lastUpdated: number;
    title: string;
    displayTitle: string;
    labels?: string[];
    rating: number;
    reviews: number;
    topArt?: boolean;
    topAmateur?: boolean;
}

export type DrawingTypePartial = {
    id: string,
    created: string,
    displayTitle: string,
    image: FileType,
}


export type DrawingsResponseSuccessType = {
    drawings: DrawingTypePartial[];
};

export type DrawingResponseSuccessType = {
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
    return axios.get<DrawingsResponseSuccessType>(HOST_DRAWINGS, {...config});
}

export const getDrawingByCategory = ({
    category,
    sortBy,
    search,
    startDate,
    endDate,
    labels,
}: {   
    category?: string | null;
    sortBy?: string | null;
    search?: string | null ;
    startDate?: number | null; 
    endDate?: number | null;
    labels?: string[] | null;
}) => {
    let computedCateg: string | undefined;
    if (category === Category.TOP_AMATEUR) {
        computedCateg = "topAmateur";
    } else if (category === Category.TOP_ART) {
        computedCateg = "topArt";
    }

    return axios.get<DrawingsResponseSuccessType>(HOST_CATEGORY_DRAWINGS, {...config, params: {
        category: computedCateg ?? undefined,
        sortBy: sortBy ?? undefined,
        search: search ?? undefined,
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
        labels: labels?.join() ?? undefined,
    }});
}

export const getDrawingByUser = (userId: string) => {
    return axios.get<DrawingsResponseSuccessType>(HOST_USER_DRAWINGS, {...config, params: {userId}});
}

export const getDrawing = (id: string) => {
    return axios.get<DrawingResponseSuccessType>(HOST_DRAWING, {...config, params: {drawingId: id}});
}

export const getDrawingsAdmin = () => {
    return axios.get<{drawings: DrawingAdminType}>(HOST_DRAWINGS_ADMIN, {...config});
}