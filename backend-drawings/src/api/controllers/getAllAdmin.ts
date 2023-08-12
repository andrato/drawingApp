import { Request, Response} from "express";
import { DrawingType } from "../utils/types";
import { modelDrawing } from "../../mongo_schema";

export const getAllAdmin = async (req: Request, res: Response) => {
    let allDrawings: (DrawingType & {rating: number; reviews: number;})[] = [];

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
        displayTitle: drawing.displayTitle,
        userId: drawing.userId,
        created: drawing.created,
        lastUpdated: drawing.lastUpdated,
        rating: drawing.rating,
        reviews: drawing.reviews,
        labels: drawing.labels,
    }));

    return res.status(200).json({
        status: 0,
        drawings: filteredDrawings,
    });
}
