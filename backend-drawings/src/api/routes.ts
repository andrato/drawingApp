import express from "express";
import { checkSchema } from "express-validator";
import { 
    deleteDrawing, 
    deleteSchema, 
    getAll, 
    getAllAdmin, 
    getByCategory, 
    getByCategorySchema, 
    getByUser, 
    getByUserSchema, 
    getDrawing, 
    getDrawingSchema, 
    updateReviews, 
    updateReviewsSchema 
} from "./controllers";

const router: express.Router = express.Router();

router.get("/", getAll);
router.get("/category", checkSchema(getByCategorySchema), getByCategory);
router.get("/drawing", checkSchema(getDrawingSchema), getDrawing);
router.get("/user", checkSchema(getByUserSchema), getByUser);
router.get("/getAdmin", getAllAdmin);
router.post("/delete", checkSchema(deleteSchema), deleteDrawing);
router.post("/updateReviews", checkSchema(updateReviewsSchema), updateReviews);

export default router;
