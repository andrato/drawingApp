import { Request, Response} from "express";
import { modelRating} from "../../mongo_schema";
import { CommentRatingType } from "../utils/types";
import { getReviewsAndRating } from "../utils/helpers";
import { validationResult } from "express-validator";

export const reviewsSchema = {
    // userId: {
    //     isLength: {
    //         errorMessage: 'userId is wrong or missing!',
    //         options: { min: 1 },
    //         location: "params",
    //     },
    // },
    drawingId: {
        isLength: {
            errorMessage: 'drawingId is wrong or missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}

export const getReviews = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    const drawingId = req.query.drawingId as string;
    const userId = req.query.userId as string | undefined;
    
    let reviews: CommentRatingType[] = [];

    try {
        reviews = await modelRating.find({drawingId});
    } catch (err) {
        return res.status(500).json({
            error: err,
        })
    }

    const {rating, sumRatings} = getReviewsAndRating(reviews);

    let userVote = reviews.find((review) => review.userId === userId);

    return res.json({
        rating,
        ratingSum: sumRatings,
        numberOfRatings: reviews.length,
        userVote: userVote,
        reviews,
    });
}