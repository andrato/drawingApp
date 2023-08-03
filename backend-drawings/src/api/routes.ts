import express from "express";
import { checkSchema } from "express-validator";
import { getAll, getByCategory, getByCategorySchema, getByUser, getByUserSchema, getDrawing, getDrawingSchema } from "./controllers";

const router: express.Router = express.Router();

router.get("/", getAll);
router.get("/category", checkSchema(getByCategorySchema), getByCategory);
router.get("/drawing", checkSchema(getDrawingSchema), getDrawing);
router.get("/user", checkSchema(getByUserSchema), getByUser);

export default router;
