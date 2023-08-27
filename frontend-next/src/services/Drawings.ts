import { getUserInfo } from "@/components/common/helpers";
import { Category } from "@/components/profile/helpers";
import axios from "axios"

export const HOST = "http://localhost:8080/drawing";
export const HOST_DRAWINGS = HOST + "/";
export const HOST_DRAWINGS_ADMIN = HOST + "/getAdmin";
export const HOST_DRAWING = HOST + "/drawing";
export const HOST_MODIFY_DRAWING = HOST + "/modifyDrawing";
export const HOST_DELETE_DRAWING = HOST + "/deleteDrawing";
export const HOST_USER_DRAWINGS = HOST + "/user";
export const HOST_CATEGORY_DRAWINGS = HOST + "/";
export const HOST_MODIFY_ADMIN = HOST + "/drawingAdmin";

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
    video: FileType;
    image: FileType;
    description?: string;
    category: string;
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
    category: string;
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

const computeCategory = (category?: string | null) => {
    if (!category) {
        return undefined;
    }

    if (category === Category.TOP_AMATEUR) {
        return "topAmateur";
    } else if (category === Category.TOP_ART) {
        return "topArt";
    }

    return undefined;
}

const computeCategoryForModify = (category?: string | null) => {
    if (!category) {
        return undefined;
    }

    if (category === Category.TOP_AMATEUR) {
        return "topAmateur";
    } else if (category === Category.TOP_ART) {
        return "topArt";
    }

    return "gallery";
}

export const getDrawingByCategory = ({
    category,
    sortBy,
    search,
    startDate,
    endDate,
    labels,
    userId,
    limit,
}: {   
    category?: string | null;
    sortBy?: string | null;
    search?: string | null ;
    startDate?: number | null; 
    endDate?: number | null;
    labels?: string[] | null;
    userId?: string;
    limit?: number;
}) => {
    const computedCateg = computeCategory(category);

    return axios.get<DrawingsResponseSuccessType>(HOST_CATEGORY_DRAWINGS, {...config, params: {
        category: computedCateg ?? undefined,
        sortBy: sortBy ?? undefined,
        search: search ?? undefined,
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
        labels: labels?.join() ?? undefined,
        userId,
        limit,
    }});
}

export const getDrawingByUser = (userId: string) => {
    return axios.get<DrawingsResponseSuccessType>(HOST_USER_DRAWINGS, {...config, params: {userId}});
}

export const getDrawing = (id: string) => {
    return axios.get<DrawingResponseSuccessType>(HOST_DRAWING, {...config, params: {drawingId: id}});
}

export const modifyDrawingAdmin = ({
    id,
    category,
}: {
    id: string, 
    category?: string,
}) => {
    const computedCateg = computeCategoryForModify(category);

    return axios.post<DrawingResponseSuccessType>(
        HOST_MODIFY_ADMIN, 
        {category: computedCateg, drawingId: id},
        {...config}
    );
}

export const getDrawingsAdmin = ({
    category,
    search,
    startDate,
    endDate,
    labels,
}: {   
    category?: string | null;
    search?: string | null ;
    startDate?: number | null; 
    endDate?: number | null;
    labels?: string[] | null;
}) => {
    const computedCateg = computeCategory(category);

    return axios.get<{drawings: DrawingAdminType}>(HOST_DRAWINGS_ADMIN, {...config, params: {
        category: computedCateg ?? undefined,
        search: search ?? undefined,
        startDate: startDate ?? undefined,
        endDate: endDate ?? undefined,
        labels: labels?.join() ?? undefined,
    }});
}

export const deleteDrawing = (drawingId: string) => {
    const userInfo = getUserInfo();
    const drawingWithUser = {drawingId, userId: userInfo.id};

    return axios.post(
        HOST_DELETE_DRAWING, 
        {},
        {...config, params: drawingWithUser}
    );
}

export const modifyDrawing = (props: {
    drawingId: string; 
    description?: string; 
    displayTitle?: string;
    labels?: string[];
}) => {
    return axios.post<DrawingResponseSuccessType>(
        HOST_MODIFY_DRAWING, 
        props,
        {...config}
    );
}