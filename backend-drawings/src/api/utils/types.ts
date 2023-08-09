type FileType = {
    location: string;
    filename: string;
    size: number;
}

export type DrawingType = {
    _id: string;
    userId: string;
    userInfo: {
        name: string,
        imgPath: string,
    },
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
    description?: string;
}