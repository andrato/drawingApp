import { NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.sendStatus(403);
    }

    const bearer = bearerHeader.split(' ');
    const token = bearer[1];

    try {
        const isOk = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        if (!isOk) {
            return res.status(400).json({
                error: "Not a valid token",
            })
        }

        next();
    } catch (err) {
        return res.status(500).json({
            error: err,
        })
    }        
}