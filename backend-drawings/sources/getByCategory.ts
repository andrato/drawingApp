import { Router, Request, Response} from "express";
import { DrawingType } from "./utils/types";
import { modelDrawing } from "../mongo_schema";
import { checkSchema } from "express-validator";

const router = Router();
const checkDrawingSchema = {
    category: {
        isIn: {
            options: [["topArt", "topAmateur"]],
            errorMessage: 'category param missing or incorrect!',
            location: "params",
        },
    },
}

router.get('/',
    checkSchema(checkDrawingSchema),
    async (req: Request, res: Response) => {
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
);

export {router as GetByCategory};