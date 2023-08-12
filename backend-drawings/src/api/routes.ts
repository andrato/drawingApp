import express from "express";
import { checkSchema } from "express-validator";
import { 
    adminModify,
    adminModifyChainValidation,
    deleteDrawing, 
    deleteSchema, 
    getAll, 
    getAllAdmin, 
    getAllAdminChainValidation, 
    getByCategory, 
    getByCategoryChainValidation, 
    getByUser, 
    getByUserSchema, 
    getDrawing, 
    getDrawingSchema, 
    updateReviews, 
    updateReviewsSchema 
} from "./controllers";

const router: express.Router = express.Router();

// router.get("/", getAll);
router.get("/", getByCategoryChainValidation, getByCategory);
router.get("/drawing", checkSchema(getDrawingSchema), getDrawing);
router.get("/user", checkSchema(getByUserSchema), getByUser);
router.post("/delete", checkSchema(deleteSchema), deleteDrawing);
router.post("/updateReviews", checkSchema(updateReviewsSchema), updateReviews);
router.get("/getAdmin", getAllAdminChainValidation, getAllAdmin);
router.post("/drawingAdmin", adminModifyChainValidation , adminModify);

export default router;
