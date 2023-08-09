import { Alert, Box, Button, Collapse, IconButton, Paper, Rating, TextField, Typography } from "@mui/material";
import { isSameUser, isUserLoggedIn } from "../common/helpers";
import { ReactNode, SyntheticEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ReviewType, postReview } from "@/services/CommentsAndRatings";
import { Close } from "@mui/icons-material";

const Container = ({children, isEditing}: {children: ReactNode; isEditing: boolean}) => (
        <Paper elevation={isEditing ? 4 : 2} sx={(theme) => ({
        mt: isEditing ? 3 : 1,
        p: 2,
        bgcolor: theme.palette.backgroundCustom.light,
        color: theme.palette.textCustom.primary,
    })}>
        {children}
    </Paper>
);

export const AddReview = ({
    drawingId, 
    updateReviews, 
    userId,
    existingRating = null,
    existingComment = null,
    setIsEditing,
}: {
    drawingId: string;
    updateReviews: (comment: ReviewType) => void; 
    userId: string;
    existingRating?: number | null;
    existingComment?: string | null;
    setIsEditing?: (isEditing: boolean) => void;
}) => {
    const userLogged = isUserLoggedIn(); 
    const [comment, setComment] = useState<string | null>(existingComment);
    const [rating, setRating] = useState<number | null>(existingRating);
    const [error, setError] = useState<string | null>(null);
    const isEditing = Boolean(existingRating);
    const {mutate: addComment, isLoading} = useMutation({
        mutationFn: (data: {comment: string | null, rating: number, drawingId: string}) => {
          return postReview(data);
        },
        onError: (error, variables, context) => {
            // An error happened!
            setError("An error occured. Please try again later!");
        },
        onSuccess: (data, variables, context) => {
            setComment(null);
            setRating(null);
            updateReviews(data.data.review);
            isEditing && setIsEditing && setIsEditing(false);
        },
    })

    const handlePost = () => {
        if (!rating) {
            setError("You need to rate the drawing before posting the review!");
            return;
        }

        setError(null);

        const data = {
            comment: comment ? comment.replace(/(?:\r\n|\r|\n)/g, '<br>') : null,
            rating,
            drawingId,
        };

        addComment(data); 
    }

    const handleChangeRating = (event: SyntheticEvent<Element, Event>, newValue: number | null) => {
        setRating(newValue);
        setError(null);
    }

    if (!userLogged) {
        <Container isEditing={false}>
            <Typography>
                You must be logged in to post a comment!
            </Typography>
        </Container>
    }

    if(isSameUser(userId)) {
        return null;
    }

    return <Container isEditing={isEditing}>
            <Box sx={(theme) => ({
                mb: 2, 
                display: "flex", 
                alignItems: "center", 
                flexDirection: "row",
                border: error ? `1px solid ${theme.palette.error.dark}` : 'none',
            })}>
                <Rating
                    value={rating}
                    onChange={handleChangeRating}
                    precision={0.5}
                    sx={(theme) => ({
                        mr: 2,
                        'svg': {
                            color: theme.palette.backgroundCustom.star,
                        },
                        'label': {
                            fontSize: "35px",
                        }
                    })}
                />
                <Typography variant="subtitle2">
                    Rate this drawing!
                </Typography>
            </Box>
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
                    ml: 2,
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
                    float: "right",
                })}
            >
                Post review
            </Button>
            {isEditing && <Button 
                variant="outlined" 
                size="medium" 
                startIcon={<Close sx={{color: (theme) => theme.palette.backgroundCustom.main }}/>}
                onClick={() => setIsEditing && setIsEditing(false)}
                disabled={isLoading}
                sx={(theme) => ({
                    mt: 2,
                    // backgroundColor: theme.palette.primary.main,
                    color: theme.palette.backgroundCustom.main,
                    fontWeight: "bold",
                    // fontSize: theme.customSizes.fontSizeButtonsText,
                    textTransform: 'none',
                    ':hover': {
                        backgroundColor: theme.palette.primary.light,
                    },
                    float: "right",
                    '>span': {
                        color: theme.palette.textCustom.primary,
                    }
                })}
            >
                Cancel
            </Button>}
    </Container>;
}