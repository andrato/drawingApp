import { getUserInfo } from "@/components/common/helpers";
import axios from "axios"

export const HOST_REVIEWS = "http://localhost:8080/review";

export type ReplyType = {
    userId: string;
    drawingId: string;
    comment: string;
    created: number;
    lastUpdated: number;
}

type Reviews = {
    rating: number;
    userRating: number;
    reviews: ReviewType[];
}

export type ReviewType = {
    userId: string;
    drawingId: string;
    rating: number;
    comment?: string;
    created: number;
    lastUpdated: number;
    replies?: number;
};

const config = {
    headers:{
        'Content-Type': 'application/json',
    }
};

export const postReview = (data: {comment: string | null, rating: number, drawingId: string}) => {
    const userInfo = getUserInfo();
    const commentWithUser = {...data, userId: userInfo.id};
    return axios.post<{review: ReviewType}>(HOST_REVIEWS + "/", commentWithUser, {...config});
}
export const getReviews = (drawingId: string) => {
    const userInfo = getUserInfo();
    return axios.get<Reviews>(HOST_REVIEWS + "/", {...config, params: {drawingId, userId: userInfo.id}});
}


export const postComment = (commentData: {comment: string, drawingId: string}) => {
    const userInfo = getUserInfo();
    const commentWithUser = {...commentData, userId: userInfo.id};
    return axios.post<{comment: ReplyType}>(HOST_REVIEWS + "/reply", commentWithUser, {...config});
}
export const getComments = (drawingId: string) => {
    return axios.get<{comments: ReplyType[]}>(HOST_REVIEWS + "/reply", {...config, params: {drawingId}});
}