import { Alert, Button, Collapse, IconButton, Paper, Rating, TextField, Typography } from "@mui/material";
import { isUserLoggedIn } from "../common/helpers";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ReviewType, postComment } from "@/services/CommentsAndRatings";
import { Close } from "@mui/icons-material";

export const AddComment = ({drawingId, updateComments, userId}: {drawingId: string, updateComments: (comment: CommentType) => void; userId: string}) => {
    const userLogged = isUserLoggedIn(); 
    const queryClient = useQueryClient();
    const [comment, setComment] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const {mutate: addComment, isLoading, isSuccess} = useMutation({
        mutationFn: (data: {comment: string, drawingId: string}) => {
          return postComment(data);
        },
        onError: (error, variables, context) => {
            // An error happened!
            setError("An error occured. Please try again later!");
        },
        onSuccess: (data, variables, context) => {
            setComment(null);
            updateComments(data.data.comment);
        },
    })

    const handlePost = () => {
        if (!comment) {
            setError("Please make sure you typed something a commment!")
            return;
        }

        setError(null);

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
            minRows={2}
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
            <Collapse in={Boolean(error)}>
                <Alert 
                    severity="error" 
                    sx={{mt: 1}}
                    action={
                        <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                            setError(null);
                        }}
                        >
                        <Close fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {error}
                </Alert>
            </Collapse>
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