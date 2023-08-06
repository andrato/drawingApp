import express from "express";
import { checkSchema } from "express-validator";
import { check, checkDrawingSchema, publish, publishSchema, save, saveSchema } from "./controllers";
import { upload } from "./utils/upload";

const router: express.Router = express.Router();

router.post("/save", checkSchema(saveSchema), upload.array('files'), save);
router.get("/check", checkSchema(checkDrawingSchema), check);
router.post("/publish", checkSchema(publishSchema), upload.array('files'), publish);

export default router;