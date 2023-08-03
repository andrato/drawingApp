import { Request, Response} from "express";
import { Types } from "mongoose";
import { DrawingType } from "../utils/types";
import { modelDrawing } from "../../mongo_schema";

export const getDrawingSchema = {
    drawingId: {
        isLength: {
            errorMessage: 'displayTitle param missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}

export const getDrawing = async (req: Request, res: Response) => {
    const drawingId = req.query.drawingId as string;

    let drawing: DrawingType | null = null;
    try {
        const mongoId = new Types.ObjectId(drawingId);
        drawing = await modelDrawing.findOne({_id: mongoId});
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: "An error occured! Please try again later!",
        })
    }

    return res.status(200).json({
        status: 0,
        drawing: drawing,
    });
}
