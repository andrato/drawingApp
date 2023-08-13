import express from "express";
import { checkSchema } from "express-validator";
import { userInfo, userInfoSchema, getUsers, addDrawingSchema, addDrawing, getUsersFilters, getUSersFiltersChainValidation } from "./controllers";

const router: express.Router = express.Router();

router.use("/info", checkSchema(userInfoSchema), userInfo);
router.use("/users", getUsers);
router.get("/filters", getUSersFiltersChainValidation, getUsersFilters);
router.post("/addDrawing", checkSchema(addDrawingSchema), addDrawing);

export default router;
