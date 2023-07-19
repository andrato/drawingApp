import { ReviewType } from "@/services/CommentsAndRatings";
import { HOST_USER, getUser } from "@/services/User";
import { Avatar, Box, Card, CardContent, CardHeader, Paper, Rating, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { ActionBar } from "./ActionBar";
import { AddReview } from "./AddReview";
import { useState } from "react";

export const Review = ({
    review,
    userId,
    updateReviews,
}: {
    review: ReviewType;
    userId: string;
    updateReviews: (review: ReviewType) => void; 
}) => {
    const [reviewAux, setReviewAux] = useState<ReviewType>(review);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const paragraphs = reviewAux.comment ? reviewAux.comment.split('<br>') : [];
    const formatDate = (new Date(reviewAux.created)).toDateString();
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [HOST_USER, reviewAux.userId],
        queryFn: () => getUser(reviewAux.userId), 
        refetchOnMount: false,
        enabled: Boolean(reviewAux.userId),
    });

    if (isLoading || isError) {
        return <Box sx={{mt: 1}}>
            <LoadingsAndErrors isLoading={isLoading} isError={isError} />
        </Box>
    }

    if (!data?.data?.user) {
        return null;
    }

    const user = data.data.user;
    const firstName = user?.firstName ?? '';
    const lastName = user?.lastName ?? '';
    const fullName = firstName.length ? (firstName + ' ' + lastName) : lastName;
    const isUnknown = !Boolean(firstName.length || lastName.length);

    return <Card elevation={2} sx={(theme) => ({
        mt: 1,
        bgcolor: theme.palette.backgroundCustom.light,
        color: theme.palette.textCustom.primary,
        '.MuiCardHeader-subheader': {
            color: theme.palette.textCustom.subHeader,
        }
    })}>
        <CardHeader
            avatar={
                <Avatar alt="userName" src={user?.imgLocation} sx={(theme) => ({bgcolor: theme.palette.textCustom.secondary, color: theme.palette.backgroundCustom.main})}>
                    {isUnknown ? 'U' : `${firstName[0]}${lastName[0]}`}
                </Avatar>
            }
            title={isUnknown ? 'Unknown' : fullName}
            subheader={formatDate}
            sx={{
                pb: 0,
            }}
        />
        <CardContent sx={{
            pt: 0, 
            display: "flex",
            flexDirection: "column",
        }}>
            <Rating
                value={reviewAux.rating}
                precision={0.5}
                sx={(theme) => ({
                    mt: 2,
                    'svg': {
                        color: theme.palette.backgroundCustom.star,
                    },
                    'label': {
                        fontSize: "35px",
                    }
                })}
                readOnly
            />
            {paragraphs.length && <Box sx={{mt: 1, mb: 2}}> 
                {paragraphs.map((text) => <Typography  variant="body1"> {text}</Typography>)}
            </Box>}
            <ActionBar userId={reviewAux.userId} onClickEdit={() => 
                setIsEditing(true)}/>
            {isEditing && <AddReview 
                drawingId={reviewAux.drawingId}
                updateReviews={(review: ReviewType) => {updateReviews(review); setReviewAux(review)}} 
                userId={userId}
                existingRating={reviewAux.rating}
                existingComment={reviewAux.comment}
                setIsEditing={setIsEditing}
            />}     
        </CardContent>
    </Card>
}