import { Request, Response} from "express";
import { modelRating} from "../../mongo_schema";
import { CommentRatingType } from "../utils/types";
import { validationResult } from "express-validator";
import { getReviewsAndRating } from "../utils/helpers";
import axios from "axios";

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

    const review: CommentRatingType = {
        drawingId: req.body.drawingId,
        userId: req.body.userId,
        rating: req.body.rating,
        created: Date.now(),
        lastUpdated: Date.now(),
    }

    if (req.body.comment) {
        review.comment = req.body.comment;
    }

    const drawingId = req.body.drawingId;
    const userId = req.body.userId;

    // get all ratings for the drawing
    let reviews: CommentRatingType[] = [];
    try {
        reviews = await modelRating.find({drawingId});
    } catch (err) {
        return res.status(500).json({
            error: "Error checking for reviews",
            err,
        })
    }

    let reviewsLength = reviews.length;
    const index = reviews.findIndex((review) => review.drawingId === drawingId && review.userId === userId);

    if (index === 1) {
        review.created = reviews[index].created;
        reviews[index].rating = review.rating;
    } else {
        reviews.push(review);
        reviewsLength++;
    }

    // check if model already exists
    let addedRating: CommentRatingType;
    try {
        addedRating = await modelRating.findOneAndUpdate({userId, drawingId}, review, {
            upsert: true, 
            returnDocument: "after",
            returnNewDocument: true,
        });
    } catch (err) {
        return res.status(500).json({
            error: err,
        })
    }

    // update drawing rating and reviews 
    const {rating: ratingResult} = getReviewsAndRating(reviews);
    try {
        await axios.post('http://backend-drawings:8003/updateReviews', {drawingId, rating: ratingResult, reviews: reviews.length}, {})
    } catch (err) {
        return res.status(500).json({
            error: err,
        })
    }

    return res.json({
        review: addedRating,
    });
}