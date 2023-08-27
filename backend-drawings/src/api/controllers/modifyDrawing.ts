import { Request, Response} from "express";
import { DrawingType } from "../utils/types";
import { modelDrawing } from "../../mongo_schema";
import { body, validationResult } from "express-validator";

export const getModifyDrawingChainValidation = [
    body("drawingId")
        .isString()
        .withMessage("Incorrect or missing drawingId!"),
    body("displayTitle")
        .optional()
        .isString()
        .withMessage("Incorrect or missing displayTitle!"),
    body("description")
        .optional()
        .isString()
        .withMessage("Incorrect or missing displayTitle!"),
    body("labels")
        .optional()
        .isArray()
        .withMessage("Incorrect labels!"),
];

export const modifyDrawing = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    const {drawingId, displayTitle, description, labels} = req.body;

    if (!displayTitle && !description && !labels) {
        return res.status(200).json({
            message: "Nothing to modify!",
        })
    }

    let drawing: DrawingType | null = null;
    try {
        drawing = await modelDrawing.findByIdAndUpdate(drawingId, {
            displayTitle,
            description,
            labels,
            lastUpdated: Date.now(),
        }, {new:true});        
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

    return res.status(200).json({
        drawing
    });
}
