import { Request, Response} from "express";
import {modelComment} from "../../mongo_schema";
import { CommentType } from "../utils/types";
import { validationResult } from "express-validator";

export const commentSchema = {
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
    comment: {
        isLength: {
            errorMessage: 'comment is wrong or missing!',
            options: { min: 1 },
        },
    },
}

export const addComment = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    const comment: CommentType = {
        drawingId: req.body.drawingId,
        userId: req.body.userId,
        comment: req.body.comments,
        created: Date.now(),
    }
    
    // add comment in db
    try {
        const addedComment = await modelComment.create(comment);

        return res.json({
            comment: addedComment,
        });
    } catch (err) {
        return res.status(500).json({
            error: err,
        })
    }
}