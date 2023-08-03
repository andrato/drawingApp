import express from "express";
import { checkSchema } from "express-validator";
import { userInfo, userInfoSchema, getUsers } from "./controllers";

const router: express.Router = express.Router();

router.use("/info", checkSchema(userInfoSchema), userInfo);
router.use("/admin/users", getUsers);

export default router;
