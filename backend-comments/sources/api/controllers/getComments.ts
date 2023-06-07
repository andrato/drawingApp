import { Request, Response} from "express";
import {modelComment} from "../../mongo_schema";
import { CommentType } from "../utils/types";
import { validationResult } from "express-validator";

export const allCommentsSchema = {
    drawingId: {
        isLength: {
            errorMessage: 'drawingId is wrong or missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}

export const getComments = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }
    
    const drawingId = req.query.drawingId as string;
    
    let comments: CommentType[] = [];

    // find all comments
    try {
        comments = await modelComment.find({drawingId});
    } catch (err) {
        return res.status(500).json({
            error: err,
        })
    }

    return res.json({
        comments: comments,
    });
}