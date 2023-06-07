import { Request, Response} from "express";
import { modelRating} from "../../mongo_schema";
import { RatingType } from "../utils/types";
import { validationResult } from "express-validator";

export const singleRatingSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId is wrong or missing!',
            options: { min: 1 },
        },
    },
    drawingId: {
        isLength: {
            errorMessage: 'drawingId is wrong or missing!',
            options: { min: 1 },
        },
    },
    rating: {
        isFloat: {
            errorMessage: 'rating is wrong or missing!',
        },
        isOptional: false,
    },
}

export const addRating = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    const rating: RatingType = {
        drawingId: req.body.drawingId,
        userId: req.body.userId,
        rating: req.body.rating,
        created: Date.now(),
    }
    
    try {
        const addedRating = await modelRating.create(rating);

        return res.json({
            rating: addedRating,
        });
    } catch (err) {
        return res.status(500).json({
            error: err,
        })
    }
}