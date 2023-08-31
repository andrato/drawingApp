import express from "express";
import { checkSchema } from "express-validator";
import { userInfo, userInfoSchema, getUsers, addDrawingSchema, addDrawing, getUsersFilters, getUSersFiltersChainValidation, modifyUser, getModifyFiltersChainValidation } from "./controllers";

const router: express.Router = express.Router();

router.use("/info", checkSchema(userInfoSchema), userInfo);
router.use("/users", getUsers);
router.get("/filters", getUSersFiltersChainValidation, getUsersFilters);
router.post("/drawing", checkSchema(addDrawingSchema), addDrawing);
router.post("/", getModifyFiltersChainValidation, modifyUser);

export default router;
