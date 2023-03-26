import { Router, Request, Response} from "express";
import jwt from "jsonwebtoken";
import { comparePassword } from "./helpers";
import {modelUser} from "../mongo_schema";
import { UserType } from "./types";
import { checkSchema, validationResult } from "express-validator";

const router = Router();

const signInSchema = {
    // Support bail functionality in schemas
    email: {
        isEmail: { 
            bail: true, 
            location: "params",
        }
    },
    password: {
        isLength: {
            errorMessage: 'Password should be at least 1 chars long!',
            // Multiple options would be expressed as an array
            options: { min: 1 },
            location: "params",
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
                errors: errors.array() ,
            });
        }
        
        const user = {
            email: req.query.email as string,
            password: req.query.password as string,
        }
        
        let existingUser: (UserType | null);

        // find user in DB
        try {
            existingUser = await modelUser.findOne({email: user.email});

            if (!existingUser || (!comparePassword(user.password, existingUser.password))) {
                return res.status(200).json({
                    status: 1,
                    error:  "Wrong credentials! If you don't have an account you can register now!"
                })
            }
        } catch (err) {
            return res.status(500).json({
                status: 1, 
                error: err,
            })
        }

        // authenticate user
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        
        return res.json({
            status: 0,
            accessToken: accessToken,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                profile: existingUser.profile ?? null,
                email: existingUser.profile,
                created: existingUser.created,
                lastUpdated: existingUser.lastUpdated,
            },
        });
    }
);

export {router as SignIn};