
import { Request, Response} from "express";
import { DrawingType } from "../utils/types";
import { modelDrawing } from "../../mongo_schema";
import { deleteFile } from "../utils/deleteS3";
import { param, validationResult } from "express-validator";
import { Types } from "mongoose";

export const deleteDrawingSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId param missing!',
            options: { min: 1 },
            location: "params",
        },
    },
    drawingId: {
        isLength: {
            errorMessage: 'userId param missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}

export const deleteDrawing = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    const drawingId = req.query.drawingId as string;
    const userId = req.query.userId as string;

    let drawing: DrawingType | null = null;
    const mongoId = new Types.ObjectId(drawingId);
    try {
        drawing = await modelDrawing.findOne({_id: mongoId});
    } catch (err) {
        return res.status(500).json({
            error: "An error occured! Please try again later!",
        })
    }

    if (!drawing) {
        return res.status(500).json({
            error: "No drawing found!",
        })
    }

    if (drawing.userId !== userId) {
        return res.status(400).json({
            error: "No permission for this action!",
        })
    }

    // delete media from aws
    try {
        deleteFile(drawing.image.filename, "images")
        deleteFile(drawing.video.filename, "videos")
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: "Error occured when deleteing from aws",
        })
    }
    
    // delete from DB
    try {
        await modelDrawing.deleteOne({_id: mongoId});
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: "An error occured! Please try again later!",
        })
    }

    return res.status(200).json();
}