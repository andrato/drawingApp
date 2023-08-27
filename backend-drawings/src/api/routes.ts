import express from "express";
import { checkSchema } from "express-validator";
import { 
    adminModify,
    adminModifyChainValidation,
    deleteAll, 
    deleteAllSchema, 
    deleteDrawing, 
    getAll, 
    getAllAdmin, 
    getAllAdminChainValidation, 
    getAllChainValidation, 
    getByUser, 
    getByUserSchema, 
    deleteDrawingSchema, 
    getDrawing, 
    getDrawingSchema, 
    getModifyDrawingChainValidation, 
    modifyDrawing, 
    updateReviews, 
    updateReviewsSchema 
} from "./controllers";

const router: express.Router = express.Router();

router.get("/", getAllChainValidation, getAll);
router.get("/drawing", checkSchema(getDrawingSchema), getDrawing);
router.get("/user", checkSchema(getByUserSchema), getByUser);
router.post("/delete", checkSchema(deleteAllSchema), deleteAll);
router.post("/updateReviews", checkSchema(updateReviewsSchema), updateReviews);
router.get("/getAdmin", getAllAdminChainValidation, getAllAdmin);
router.post("/drawingAdmin", adminModifyChainValidation , adminModify);
router.post("/deleteDrawing", checkSchema(deleteDrawingSchema), deleteDrawing);
router.post("/modifyDrawing", getModifyDrawingChainValidation, modifyDrawing);

export default router;
