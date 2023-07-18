import { Request, Response} from "express";
import {modelReply} from "../../mongo_schema";
import { ReplyType } from "../utils/types";
import { validationResult } from "express-validator";

export const allRepliesSchema = {
    commentId: {
        isLength: {
            errorMessage: 'drawingId is wrong or missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}

export const getReplies = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }
    
    const commentId = req.query.drawingId as string;
    
    let replies: ReplyType[] = [];

    // find all comments
    try {
        replies = await modelReply.find({commentId});
    } catch (err) {
        return res.status(500).json({
            error: err,
        })
    }

    return res.json({
        comments: replies,
    });
}