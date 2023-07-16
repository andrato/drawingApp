import { Request, Response} from "express";
import { modelRating} from "../../mongo_schema";
import { RatingType } from "../utils/types";
import { validationResult } from "express-validator";

export const ratingSchema = {
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

export const getRating = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    const drawingId = req.query.drawingId as string;
    const userId = req.query.userId as string;
    
    let ratings: RatingType[] = [];

    try {
        ratings = await modelRating.find({drawingId});
    } catch (err) {
        return res.status(500).json({
            error: err,
        })
    }

    let computedRatings = 0;
    if (!ratings.length) {
        const sumRatings = ratings.reduce(
            (accumulator, currentValue) => accumulator + currentValue.rating,
            0
        );

        computedRatings = sumRatings / ratings.length;
    }

    let userVote = ratings.find((rating) => rating.userId === userId);

    return res.json({
        rating: computedRatings,
        userVote: userVote,
    });
}