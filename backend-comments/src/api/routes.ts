import express from "express";
import { checkSchema } from "express-validator";
import { getReplies, allRepliesSchema } from "./controllers/getReplies";
import { addReply, replySchema } from "./controllers/addReply";
import { reviewSchema, addReview } from "./controllers/addReview";
import { getReviews, reviewsSchema } from "./controllers/getReviews";

const router: express.Router = express.Router();

router.get("/", checkSchema(reviewsSchema), getReviews);
router.post("/", checkSchema(reviewSchema), addReview);
router.get("/reply", checkSchema(allRepliesSchema), getReplies);
router.post("/reply", checkSchema(replySchema), addReply);

export default router;
