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
    category: "gallery",
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
    labels?: string[];
    rating?: number;
    reviews?: number;
    category?: string;
    video: FileType;
    image: FileType;
}