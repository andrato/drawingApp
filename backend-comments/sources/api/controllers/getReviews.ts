import { Request, Response} from "express";
import { modelRating} from "../../mongo_schema";
import { CommentRatingType } from "../utils/types";
import { validationResult } from "express-validator";

export const reviewsSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId is wrong or missing!',
            options: { min: 1 },
            location: "params",
        },
    },
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
    const userId = req.query.userId as string;
    
    let reviews: CommentRatingType[] = [];

    try {
        reviews = await modelRating.find({drawingId});
    } catch (err) {
        return res.status(500).json({
            error: err,
        })
    }

    let computedRatings = 0;
    if (!reviews.length) {
        const sumRatings = reviews.reduce(
            (accumulator, currentValue) => accumulator + currentValue.rating,
            0
        );

        computedRatings = sumRatings / reviews.length;
    }

    let userVote = reviews.find((review) => review.userId === userId);

    return res.json({
        rating: computedRatings,
        userVote: userVote,
        reviews,
    });
}