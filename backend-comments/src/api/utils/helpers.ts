
import { CommentRatingType } from "../utils/types";

export const getReviewsAndRating = (reviews: CommentRatingType[]) => {
    let rating = 0;
    let sumRatings = 0;
    if (reviews.length) {
        sumRatings = reviews.reduce(
            (accumulator, currentValue) => accumulator + currentValue.rating,
            0
        );

        rating = sumRatings / reviews.length;
    }

    return {
        rating,
        sumRatings,
    }
}