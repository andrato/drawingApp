import dotenv from "dotenv";
import express, {Express} from "express";
// import upload from 'express-fileupload';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { Save } from "./sources/save";

dotenv.config();

/* connect to mongo */
(async() => {
    try {
        await mongoose.connect(process.env.MONGO_AUTH);
        console.log("Mongo successfully connected");
    } catch (err) {
        console.log("Mongo error connection: " + err);
    }
})();

/* app */
const app:Express = express();
// app.use(upload());
app.use(bodyParser.json());
app.use(cors());

// define app routes
app.use("/save", Save);

app.listen(process.env.PORT, () => {console.log(`Listening on port ${process.env.PORT}`)});