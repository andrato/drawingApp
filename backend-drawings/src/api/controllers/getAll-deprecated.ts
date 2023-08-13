import { Request, Response} from "express";
import { DrawingType } from "../utils/types";
import { modelDrawing } from "../../mongo_schema";

export const getAllDeprecated = async (req: Request, res: Response) => {
    let allDrawings: DrawingType[] = [];

    try {
        allDrawings = await modelDrawing.find();
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: "An error occured! Please try again later!",
        })
    }

    const filteredDrawings = allDrawings.map((drawing) => ({
        id: drawing._id,
        created: drawing.created,
        displayTitle: drawing.displayTitle,
        image: drawing.image,
    }));

    return res.status(200).json({
        status: 0,
        drawings: filteredDrawings,
    });
}
