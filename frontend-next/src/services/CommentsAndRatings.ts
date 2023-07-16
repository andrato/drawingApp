import { getUserInfo } from "@/components/common/helpers";
import axios from "axios"

export const HOST_COMMENTS = "http://localhost:8080/comments";

export type CommentType = {
    userId: string;
    drawingId: string;
    comment: string;
    created: number;
}

const config = {
    headers:{
        'Content-Type': 'application/json',
    }
};

export const postComment = (commentData: {comment: string, drawingId: string}) => {
    const userInfo = getUserInfo();
    const commentWithUser = {...commentData, userId: userInfo.id};
    return axios.post<{comment: CommentType}>(HOST_COMMENTS + "/", commentWithUser, {...config});
}

export const getComments = (drawingId: string) => {
    return axios.get<{comments: CommentType[]}>(HOST_COMMENTS + "/", {...config, params: {drawingId}});
}