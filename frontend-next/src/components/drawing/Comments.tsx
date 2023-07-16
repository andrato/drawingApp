
import { CommentType, HOST_COMMENTS, getComments } from "@/services/CommentsAndRatings";
import { Box } from "@mui/material"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { Comment } from './Comment';
import { useEffect } from "react";
import { AddComment } from "./AddComment";

export const Comments = ({drawingId}: {drawingId: string}) => {
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [HOST_COMMENTS, drawingId],
        queryFn: () => getComments(drawingId), 
        refetchOnMount: true,
    });
    const comments = data?.data?.comments ?? [];
    const queryClient = useQueryClient();

    const setComment = (comment: CommentType) => {
        const aux = comments;
        aux.push(comment);
        queryClient.setQueryData([HOST_COMMENTS, drawingId], {
            data: {
                ...data?.data,
                comments: aux
            }
        });
    }

    useEffect(() => {
    }, [comments]);

    if (isLoading || isError) {
        return <Box sx={{mt: 1}}>
            <LoadingsAndErrors isLoading={isLoading} isError={isError} />
        </Box>
    }

    if (comments.length === 0) {
        return null;
    }

    return <Box sx={{display: "flex", flexDirection: "column"}}>
        <AddComment drawingId={drawingId} updateComments={setComment} />
        {comments.map((comment) => <Comment comment={comment} /> )}
    </Box>
}