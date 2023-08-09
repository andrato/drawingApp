import dotenv from "dotenv";
import express, {Express} from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./api/routes";

dotenv.config();

/* connect to mongo */
(async() => {
    try {
        await mongoose.connect(process.env.MONGO_AUTH ?? "");
        console.log("Mongo successfully connected");
    } catch (err) {
        console.log("Mongo error connection user auth: " + err);
    }
})();

/* app */
const app:Express = express();
app.use(bodyParser.json());
app.use(cors());

// define app routes
app.use(router);

export default app;
