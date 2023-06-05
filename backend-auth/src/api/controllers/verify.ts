import { Request, Response} from "express";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export const verifySchema = {
    token: {
        isLength: {
            errorMessage: 'Invalid or missing token!',
            options: { min: 1 },
            location: "body",
        },
    },
}

export const verify = async (req: Request, res: Response) => {
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