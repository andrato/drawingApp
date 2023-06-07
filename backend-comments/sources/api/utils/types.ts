export type CommentType = {
    userId: string;
    drawingId: string;
    comment: string;
    created: number;
}

export type RatingType = {
    userId: string;
    drawingId: string;
    rating: number;
    created: number;
}