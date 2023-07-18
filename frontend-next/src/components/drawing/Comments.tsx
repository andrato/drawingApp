import { useEffect, useState } from "react";
import { CommentType, HOST_COMMENTS, getComments } from "@/services/CommentsAndRatings";
import { Box } from "@mui/material"
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { Comment } from './Comment';
import { AddComment } from "./AddComment";
import { debounce } from "lodash";

export const Comments = ({drawingId}: {drawingId: string}) => {
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [HOST_COMMENTS, drawingId],
        queryFn: () => getComments(drawingId), 
        refetchOnMount: true,
    });
    const [comments, setComments] = useState<CommentType[]>(data?.data?.comments ?? []);

    const setComment = (comment: CommentType) => {
        setComments([...comments, comment]);
    };

    useEffect(debounce(() => setComments(data?.data?.comments ?? []), 100), [data?.data?.comments]);

    if (isLoading || isError) {
        return <Box sx={{mt: 1}}>
            <LoadingsAndErrors isLoading={isLoading} isError={isError} />
        </Box>
    }

    return <Box sx={{display: "flex", flexDirection: "column"}}>
        <AddComment drawingId={drawingId} updateComments={setComment} />
        {comments.length > 0 && comments.map((comment) => <Comment comment={comment} /> )}
    </Box>
}