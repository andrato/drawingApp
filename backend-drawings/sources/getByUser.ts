import { Router, Request, Response} from "express";
import { DrawingType } from "./utils/types";
import { modelDrawing } from "../mongo_schema";
import { checkSchema } from "express-validator";

const router = Router();
const checkDrawingSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId param missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}

router.get('/',
    checkSchema(checkDrawingSchema),
    async (req: Request, res: Response) => {
        const userId = req.query.userId;

        let drawings: DrawingType[] = [];
        try {
            drawings = await modelDrawing.find({userId: userId});
            
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
);

export {router as GetByUser};