import dotenv from "dotenv";
import express, {Express} from "express";
import cors from "cors";
import proxy from 'express-http-proxy';
import url from'url';
import {checkToken} from './checkToken';

dotenv.config();

/* app */
const app:Express = express();
app.use(cors());

/* logged in user checks */
app.use('/progress/*', checkToken);
app.post('/review/*', checkToken);
app.post('/user/*', checkToken);
app.use('/admin/*', checkToken);

/* redirects */
app.use('/drawing/*', proxy('http://backend-drawings:8003', {
    proxyReqPathResolver:  (req) => {
        const urlPath = url.parse(req.originalUrl).path;
        return urlPath?.replace("/drawing", "") ?? "";
      }
}));

app.use('/progress/*', proxy('http://backend-drawings-in-progress:8002', {
    limit: '500mb',
    proxyReqPathResolver:  (req) => {
        const urlPath = url.parse(req.originalUrl).path;
        return urlPath?.replace("/progress", "") ?? "";
    },

}));

app.use('/user/*', proxy('http://backend-users:8004', {
    proxyReqPathResolver:  (req) => {
        const urlPath = url.parse(req.originalUrl).path;
        return urlPath?.replace("/user", "") ?? "";
      }
}));

app.use('/review/*', proxy('http://backend-comments:8005', {
    proxyReqPathResolver:  (req) => {
        const urlPath = url.parse(req.originalUrl).path;
        return urlPath?.replace("/review", "") ?? "";
      }
}));


app.use('/admin/*', proxy('http://backend-auth:8001', {
    proxyReqPathResolver:  (req) => {
        const urlPath = url.parse(req.originalUrl).path;
        return urlPath?.replace("/admin", "") ?? "";
      }
}));

app.use('/', proxy('http://backend-auth:8001', {
    proxyReqPathResolver:  (req) => {
        const urlPath = url.parse(req.originalUrl).path;
        return urlPath?.replace("/auth", "") ?? "";
      }
}));

app.listen(process.env.PORT, () => {console.log(`Listening on port ${process.env.PORT}`)});