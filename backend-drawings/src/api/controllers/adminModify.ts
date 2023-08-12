import { Request, Response} from "express";
import { DrawingType } from "../utils/types";
import { modelDrawing } from "../../mongo_schema";
import { body, param, validationResult } from "express-validator";

export const adminModifyChainValidation = [
    body("drawingId")
      .isString()
      .withMessage("Incorrect or missing id!"),
    body("category")
        .isString()
        .withMessage("Incorrect category!")
        .isIn(["topArt", "topAmateur", "Gallery"])
        .withMessage("category value is invalid!"),
];

export const adminModify = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }
    const {drawingId, category} = req.body;

    let drawing: DrawingType | null;
    try {
        drawing = await modelDrawing.findByIdAndUpdate(drawingId, { $set: { category } }, {
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

    return res.status(200).json();
}
