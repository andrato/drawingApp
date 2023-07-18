import { useEffect, useState } from "react";
import { ReviewType, HOST_REVIEWS, getComments, getReviews } from "@/services/CommentsAndRatings";
import { Box } from "@mui/material"
import { useQuery } from "@tanstack/react-query";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { Review } from './Review';
import { debounce } from "lodash";
import { AddReview } from "./AddReview";
import { isSameUser } from "../common/helpers";

export const Reviews = ({drawingId, userId}: {drawingId: string; userId: string;}) => {
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [HOST_REVIEWS, drawingId],
        queryFn: () => getReviews(drawingId), 
        refetchOnMount: true,
    });
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [myReview, setMyReview] = useState<ReviewType | undefined>();

    const setReview = (review: ReviewType) => {
        setReviews([...reviews]);
        setMyReview(review);
    };

    // sort reviews by date
    useEffect(debounce(() => {
        const auxReview = data?.data?.reviews ?? [];

        // check for logged in user review
        const index = auxReview.findIndex((review) => isSameUser(review.userId));
        if (index > -1) {
            setMyReview(auxReview[index]);
            auxReview.splice(index, 1);
        }

        const sortedReviews = auxReview.sort((review1, review2) => review2.created - review1.created);
        
        setReviews(sortedReviews);
    }, 100), [data?.data?.reviews]);

    if (isLoading || isError) {
        return <Box sx={{mt: 1}}>
            <LoadingsAndErrors isLoading={isLoading} isError={isError} />
        </Box>
    }

    return <Box sx={{display: "flex", flexDirection: "column"}}>
        {myReview 
            ? <Review userId={userId} review={myReview} key={myReview.created + myReview.userId}/> 
            : <AddReview drawingId={drawingId} updateReviews={setReview} userId={userId}/>
        }
        {reviews.length > 0 && reviews.map((review) => <Review 
            key={review.created + review.userId} 
            review={review} 
            userId={userId}
        /> )}
    </Box>
}