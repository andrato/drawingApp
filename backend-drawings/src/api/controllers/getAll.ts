import { Request, Response} from "express";
import { modelDrawing } from "../../mongo_schema";
import { DrawingType, SortBy } from "../utils/types";
import { sortDrawings } from "../utils/helpers";
import { param, validationResult } from "express-validator";

export const getAllChainValidation = [
    param("category")
      .optional()
      .isString()
      .withMessage("Incorrect category!")
      .isIn(["topArt", "topAmateur"])
      .withMessage("category value is invalid!"),
    param("userId")
      .optional()
      .isString()
      .withMessage("Incorrect userId!"),
    param("sortBy")
      .optional()
      .isString()
      .withMessage("Incorrect sortBy!")
      .isIn(["newest", "oldest", "highRatings", "lowRatings", "reviewsUp", "reviewsDown"])
      .withMessage("sortBy value is invalid!"),
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
    param("limit")
      .optional()
      .isDecimal()
      .withMessage("Incorrect limit!"),
    param("labels")
      .optional()
      .isString()
      .withMessage("Incorrect labels!"),
];

export const getAll = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    const {category, sortBy, search, startDate, endDate, labels, userId, limit} = req.query;

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
        ...(userId ? {userId} : {}),
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

    console.log("sortBy is: " + sortBy);

    let drawingsSorted: DrawingType[] = sortBy ? sortDrawings(drawings, sortBy as SortBy) : drawings;

    const filteredDrawings = drawingsSorted.map((drawing) => ({
        id: drawing._id,
        created: drawing.created,
        displayTitle: drawing.displayTitle,
        rating: drawing.rating,
        reviews: drawing.reviews,
        image: drawing.image,
    }));

    const computedLimit = limit as unknown as number;
    
    return res.status(200).json({
        status: 0,
        drawings: limit ? filteredDrawings.slice(0, computedLimit) : filteredDrawings,
    });
}
