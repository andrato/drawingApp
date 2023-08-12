import { Request, Response} from "express";
import { DrawingType } from "../utils/types";
import { modelDrawing } from "../../mongo_schema";
import { param, validationResult } from "express-validator";

export const getAllAdminChainValidation = [
    param("category")
      .optional()
      .isString()
      .withMessage("Incorrect category!")
      .isIn(["topArt", "topAmateur"])
      .withMessage("category value is invalid!"),
    param("search")
      .optional()
      .isString()
      .withMessage("Incorrect search!"),
    param("startDate")
      .optional()
      .isDecimal()
      .withMessage("Incorrect startDate!"),
    param("endDate")
      .optional()
      .isDecimal()
      .withMessage("Incorrect endDate!"),
    param("labels")
      .optional()
      .isString()
      .withMessage("Incorrect labels!"),
];

export const getAllAdmin = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    const {category, search, startDate, endDate, labels} = req.query;

    const created = {
        ...(startDate ? {$gte: startDate} : {}), 
        ...(endDate ? {$lte: endDate} : {}),
    }
    const labelsArray = labels ? (labels as string).split(",") : [];

    const searchDrawings = {
        ...(category ? {category: category} : {}),
        ...(startDate || endDate ? {created: created} : {}),
        ...(search ? {displayTitle: { $regex: search, $options: 'i' }} : {}),
        ...(labels ? {labels: { $all: labelsArray}} : {}),
    }

    let drawings: DrawingType[] = [];
    try {
        drawings = await modelDrawing.find(searchDrawings);        
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: "An error occured! Please try again later!",
        })
    }

    const filteredDrawings = drawings.map((drawing) => ({
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
