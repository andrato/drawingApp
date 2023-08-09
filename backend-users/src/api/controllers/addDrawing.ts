import { Request, Response} from "express";
import {modelUserInfo} from "../../mongo_schema";
import { UserType } from "../helpers/types";
import { validationResult } from "express-validator";

export const addDrawingSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId is wrong or missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}

export const addDrawing = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: 1,
            errors: errors.array(),
        });
    }
            
    const userId = req.query.userId as string;

    // update number of drawings
    try {
        await modelUserInfo.findByIdAndUpdate(userId, { $inc: { drawings: 1 } });
    } catch (err) {
        return res.status(500).json({
            error: "An error occured! Please try again later",
        })
    }

    return res.json();
}
