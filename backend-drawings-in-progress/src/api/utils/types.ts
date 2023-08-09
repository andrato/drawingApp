export const defaultDrawingInProgress: DrawingType = {
    userId: "",
    created: Date.now(),
    lastUpdated: Date.now(),
    title: "",
    video: {
        location: "",
        filename: "",
        size: 0,
    },
    image: {
        location: "",
        filename: "",
        size: 0,
    },
}

type FileType = {
    location: string;
    filename: string;
    size: number;
}

export type DrawingType = {
    userId: string;
    userInfo?: {
        name: string,
        imgPath: string,
    },
    description?: string,
    created: number;
    lastUpdated: number;
    title: string;
    displayTitle?: string;
    categories?: string[];
    rating?: number;
    reviews?: number;
    topArt?: boolean;
    topAmateur?: boolean;
    video: FileType;
    image: FileType;
}