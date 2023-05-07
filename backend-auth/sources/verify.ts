import { Router, Request, Response} from "express";
import jwt from "jsonwebtoken";
import { comparePassword } from "./helpers";
import {modelUser} from "../mongo_schema";
import { UserType } from "./types";
import { checkSchema, validationResult } from "express-validator";

const router = Router();

const signInSchema = {
    token: {
        isLength: {
            errorMessage: 'Invalid or missing token!',
            options: { min: 1 },
            location: "body",
        },
    },
}

router.get('/', 
    checkSchema(signInSchema),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                status: 1,
                errors: errors.array(),
            });
        }
        
        const token = req.body.token;

        // find user in DB
        try {
            const isOk = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            if (!isOk) {
                return res.status(500).json({
                    status: 1, 
                    error: "Not a valid token",
                })
            }
        } catch (err) {
            return res.status(500).json({
                status: 1, 
                error: err,
            })
        }        
        
        return res.json({
            status: 0,
        });
    }
);

export {router as VerifyToken};