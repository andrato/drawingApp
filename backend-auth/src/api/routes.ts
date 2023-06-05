import express from "express";
import { checkSchema } from "express-validator";
import { signInSchema, signUpSchema, signin, signup } from "./controllers";

const router: express.Router = express.Router();

router.get("/signin", checkSchema(signInSchema), signin);
router.post("/signup", checkSchema(signUpSchema), signup);
// router.get("/verify", getTodosByStatus);

export default router;
