export type ReplyType = {
    userId: string;
    drawingId: string;
    commentId: string;
    reply: string;
    created: number;
}

export type CommentRatingType = {
    userId: string;
    drawingId: string;
    rating: number;
    comment?: string;
    created: number;
    lastUpdated: number;
    replies?: number;
}