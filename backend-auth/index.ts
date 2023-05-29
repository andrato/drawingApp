import dotenv from "dotenv";
import express, {Express} from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { SignIn } from "./sources/routes/signin";
import { SignUp } from "./sources/routes/signup";
import { VerifyToken } from "./sources/verify";

dotenv.config();

/* connect to mongo */
(async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL_TEST);
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
app.use("/signin", SignIn);
app.use("/signup", SignUp);
app.use("/verify", VerifyToken);

app.listen(process.env.PORT, () => {console.log(`Listening on port ${process.env.PORT}`)});