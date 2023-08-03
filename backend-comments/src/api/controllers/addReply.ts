import { Request, Response} from "express";
import {modelReply} from "../../mongo_schema";
import { ReplyType } from "../utils/types";
import { validationResult } from "express-validator";

export const replySchema = {
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
    commentId: {
        isLength: {
            errorMessage: 'commentId is wrong or missing!',
            options: { min: 1 },
        },
    },
    reply: {
        isLength: {
            errorMessage: 'comment is wrong or missing!',
            options: { min: 1 },
        },
    },
}

export const addReply = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    const comment: ReplyType = {
        drawingId: req.body.drawingId,
        userId: req.body.userId,
        commentId: req.body.commentId,
        reply: req.body.reply,
        created: Date.now(),
    }
    
    // add comment in db
    try {
        const response = await modelReply.create(comment);

        return res.json({
            comment: response,
        });
    } catch (err) {
        return res.status(500).json({
            error: err,
        })
    }
}