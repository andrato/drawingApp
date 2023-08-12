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
    labels: string[];
    rating: number;
    reviews: number;
    category: string;
    video: FileType;
    image: FileType;
    description?: string;
}

export enum SortBy {
    NEWEST = "newest",
    OLDEST = "oldest",
    RATINGS_HIGH = "highRatings",
    RATINGS_LOW = "lowRatings",
    MOST_REVIEWED = "reviewsUp",
    LEAST_REVIEWED = "reviewsDown",
}