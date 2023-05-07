import dotenv from "dotenv";
import express, {Express} from "express";
import cors from "cors";
import proxy from 'express-http-proxy';
import url from'url';

dotenv.config();

/* connect to mongo */
// (async() => {
//     try {
//         await mongoose.connect(process.env.MONGO_AUTH);
//         console.log("Mongo successfully connected");
//     } catch (err) {
//         console.log("Mongo error connection: " + err);
//     }
// })();

/* app */
const app:Express = express();
// app.use(upload());
app.use(cors());

app.use('/auth', proxy('http://localhost:8001', {
    proxyReqPathResolver:  (req) => {
        const urlPath = url.parse(req.originalUrl).path;
        return urlPath?.replace("/auth", "") ?? "";
      }
}));

app.use('/progress', proxy('http://localhost:8002', {
    proxyReqPathResolver:  (req) => {
        const urlPath = url.parse(req.originalUrl).path;
        return urlPath?.replace("/progress", "") ?? "";
    },

}));

app.use('/drawing/*', proxy('http://localhost:8003', {
    proxyReqPathResolver:  (req) => {
        const urlPath = url.parse(req.originalUrl).path;
        return urlPath?.replace("/drawing", "") ?? "";
      }
}));

app.use('/user/*', proxy('http://localhost:8004', {
    proxyReqPathResolver:  (req) => {
        const urlPath = url.parse(req.originalUrl).path;
        return urlPath?.replace("/user", "") ?? "";
      }
}));

app.listen(process.env.PORT, () => {console.log(`Listening on port ${process.env.PORT}`)});