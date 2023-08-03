import { Request, Response} from "express";
import { modelRating} from "../../mongo_schema";
import { CommentRatingType } from "../utils/types";
import { validationResult } from "express-validator";

export const reviewSchema = {
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

export const addReview = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    const rating: CommentRatingType = {
        drawingId: req.body.drawingId,
        userId: req.body.userId,
        rating: req.body.rating,
        created: Date.now(),
        lastUpdated: Date.now(),
    }

    if (req.body.comment) {
        rating.comment = req.body.comment;
    }

    console.log("aici");

    // check if model already exists
    try {
        const addedRating = await modelRating.findOneAndUpdate({userId: req.body.userId, drawingId: req.body.drawingId}, rating, {
            upsert: true, 
            returnDocument: "after",
            returnNewDocument: true,
        });

        return res.json({
            review: addedRating,
        });
    } catch (err) {
        return res.status(500).json({
            error: err,
        })
    }
}