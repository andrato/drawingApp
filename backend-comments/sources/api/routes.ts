import express from "express";
import { checkSchema } from "express-validator";
import { getComments, allCommentsSchema } from "./controllers/getComments";
import { addComment, commentSchema } from "./controllers/addComments";
import { addRating, singleRatingSchema } from "./controllers/addRating";
import { getRating, ratingSchema } from "./controllers/getRating";

const router: express.Router = express.Router();

router.get("/", checkSchema(allCommentsSchema), getComments);
router.post("/", checkSchema(commentSchema), addComment);
router.get("/rating", checkSchema(ratingSchema), getRating);
router.post("/rating", checkSchema(singleRatingSchema), addRating);

export default router;
