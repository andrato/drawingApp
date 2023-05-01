import { Router, Request, Response} from "express";
import { modelDrawing, modelDrawingInProgress } from "../mongo_schema";
import { DrawingType } from "./utils/types";
import { checkSchema, validationResult } from "express-validator";

const router = Router();

const checkDrawingSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId param missing!',
            options: { min: 1 },
            location: "params",
        },
    },
    name: {
        isLength: {
            errorMessage: 'name param missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}
router.get('/',
    checkSchema(checkDrawingSchema),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                status: 1,
                errors: errors.array(),
            });
        }

        const drawingName = req.query.name;
        const userId = req.query.userId;

        const name = `${userId}_${drawingName}`;

        let existingDrawing: (DrawingType & {_id: string} | null) = null;

        // if we find drawing in db, we update it
        try {
            existingDrawing = await modelDrawing.findOne({name: name});
        } catch (err) {
            return res.status(500).json({
                status: 1, 
                error: err,
            })
        }

        if (existingDrawing !== null) {
            return res.status(200).json({
                status: 1, 
                error: "There is already a drawing with this name. Please select another one!",
            });
        }

        try {
            existingDrawing = await modelDrawingInProgress.findOne({name: name});
        } catch (err) {
            return res.status(500).json({
                status: 1, 
                error: err,
            })
        }

        if (existingDrawing !== null) {
            return res.status(200).json({
                status: 1, 
                error: "There is already a drawing with this name. Please select another one!",
            });
        }

        return res.status(200).json({
            status: 0, 
            message: "All good",
        });
    }
);

export {router as Check};