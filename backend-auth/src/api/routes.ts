import express from "express";
import { checkSchema } from "express-validator";
import { deleteUser, deleteUserSchema, getUsers, modifyAdmin, modifyAdminSchema, signInSchema, signUpSchema, signin, signup } from "./controllers";

const router: express.Router = express.Router();

router.get("/signin", checkSchema(signInSchema), signin);
router.post("/signup", checkSchema(signUpSchema), signup);
router.get("/modify", checkSchema(modifyAdminSchema), modifyAdmin);
router.get("/users", getUsers);
router.get("/delete", checkSchema(deleteUserSchema), deleteUser);

export default router;
