import { Button, Paper, TextField, Typography } from "@mui/material";
import { isUserLoggedIn } from "../common/helpers";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CommentType, postComment } from "@/services/CommentsAndRatings";

export const AddComment = ({drawingId, updateComments}: {drawingId: string, updateComments: (comment: CommentType) => void}) => {
    const userLogged = isUserLoggedIn(); 
    const queryClient = useQueryClient();
    const [comment, setComment] = useState<string | null>(null);
    const {mutate: addComment, isLoading, isSuccess} = useMutation({
        mutationFn: (data: {comment: string, drawingId: string}) => {
          return postComment(data);
        },
        onError: (error, variables, context) => {
            // An error happened!
            console.log("An error occured");
        },
        onSuccess: (data, variables, context) => {
            setComment(null);
            updateComments(data.data.comment);
        },
    })

    const handlePost = () => {
        if (!comment) {
            return;
        }

        const data = {
            comment: comment.replace(/(?:\r\n|\r|\n)/g, '<br>'),
            drawingId
        };

        addComment(data); 
        // if no error => add data to comments 
    }

    return <Paper elevation={2} sx={(theme) => ({
        mt: 1,
        p: 2,
        bgcolor: theme.palette.backgroundCustom.light,
        color: theme.palette.textCustom.primary,
    })}>
        {userLogged ? <>
            <TextField
            id="outlined-multiline-flexible"
            multiline
            maxRows={10}
            onChange={(event) => setComment(event.target.value)}
            value={comment ?? ''}
            sx={(theme) => ({
                width: "100%",
                bgcolor: theme.palette.backgroundCustom.main,
                '.MuiInputBase-input': {
                    color: theme.palette.textCustom.primary,
                }
            })}
            />
            <Button 
                variant="contained" 
                size="medium" 
                onClick={handlePost}
                disabled={isLoading}
                sx={(theme) => ({
                    mt: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.backgroundCustom.main,
                    fontWeight: "bold",
                    // fontSize: theme.customSizes.fontSizeButtonsText,
                    textTransform: 'none',
                    ':hover': {
                        backgroundColor: theme.palette.primary.light,
                    },
                    // p: "3px 12px",
                    display: "block", 
                    float: "right"
                })}
            >
                Post comment
            </Button>
        </> : 
            <Typography>
                You must be logged in to post a comment!
            </Typography>
        }
    </Paper>;
}