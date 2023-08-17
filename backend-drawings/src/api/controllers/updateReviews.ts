import { Request, Response } from "express";
import { modelDrawing } from "../../mongo_schema";
import { DrawingType } from "../utils/types";
import { validationResult } from "express-validator";

export const updateReviewsSchema = {
    drawingId: {
        isLength: {
            errorMessage: 'Missing or incorrect drawingId!',
            options: { min: 1 },
        },
    },
    rating: {
        isFloat: {
            errorMessage: 'rating is wrong or missing!',
        },
        isOptional: false,
    },
    reviews: {
        isDecimal: {
            errorMessage: 'reviews is wrong or missing!'
        },
        isOptional: false,
    },
}

export const updateReviews = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    let drawing: DrawingType | null;

    const {drawingId, rating, reviews} = req.body;

    try {
        drawing = await modelDrawing.findByIdAndUpdate(drawingId, { $set: { rating, reviews} }, {
            returnDocument: "after",
        });

        if (!drawing) {
            return res.status(500).json({
                status: 1, 
                error: "Drawing could not be found!",
            })
        }
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: "An error occured! Please try again later!",
        })
    }

    return res.status(200).json({
        drawing,
    });
}