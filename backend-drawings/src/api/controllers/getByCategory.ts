import { Request, Response} from "express";
import { modelDrawing } from "../../mongo_schema";
import { DrawingType } from "../utils/types";
import { validationResult } from "express-validator";

export const getByCategorySchema = {
    category: {
        isIn: {
            options: [["topArt", "topAmateur"]],
            errorMessage: 'category param missing or incorrect!',
            location: "params",
        },
    },
}

export const getByCategory = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    const category = req.query.category;

    let drawings: DrawingType[] = [];
    try {
        if (category === "topArt") {
            drawings = await modelDrawing.find({topArt: true});
        } else {
            drawings = await modelDrawing.find({topAmateur: true});
        }
        
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: "An error occured! Please try again later!",
        })
    }

    const filteredDrawings = drawings.map((drawing) => ({
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
