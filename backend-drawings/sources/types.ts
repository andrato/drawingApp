export const defaultDrawingInProgress: DrawingType = {
    userId: "",
    created: Date.now(),
    lastUpdated: Date.now(),
    name: "",
    video: {
        destination: "",
        filename: "",
        path: "",
        size: 0,
    },
    image: {
        destination: "",
        filename: "",
        path: "",
        size: 0,
    },
}

type FileType = {
    destination: string;
    filename: string;
    path: string;
    size: number;
}

export type DrawingType = {
    userId: string;
    created: number;
    lastUpdated: number;
    categories?: string[];
    likes?: number, 
    comments?: number,
    name: string;
    video: FileType,
    image: FileType,
}