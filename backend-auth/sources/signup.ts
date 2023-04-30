import { Router, Request, Response} from "express";
import { generateHash } from "./helpers";
import {modelUser} from "../mongo_schema";
import { defaultUser, UserType } from "./types";
import { validationResult, checkSchema } from "express-validator";

const router = Router();

const signUpSchema = {
    firstName: {
        isLength: {
            errorMessage: 'Invalid firstName!',
            // Multiple options would be expressed as an array
            options: { min: 1 },
        },
    },
    lastName: {
        isLength: {
            errorMessage: 'Invalid lastName!',
            // Multiple options would be expressed as an array
            options: { min: 1 },
        },
    },
    // Support bail functionality in schemas
    email: {
        isEmail: {
            bail: true,
            errorMessage: 'Invalid email!',
        },
    },
    password: {
        isLength: {
            errorMessage: 'Password should be at least 8 chars long!',
            // Multiple options would be expressed as an array
            options: { min: 8 },
        },
    },
}

router.post('/',
    checkSchema(signUpSchema),
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                status: 1,
                errors: errors.array() ,
            });
        }

        // get user
        const user = req.body;

        // Check if user exists
        try {
            const existingUser: (UserType | null) = await modelUser.findOne({email: user.email});

            if (existingUser) {
                return res.status(200).json({
                    status: 1,
                    error:  "There is already a user with this email address!"
                })
            }
        } catch (err) {
            return res.status(500).json({
                status: 1, 
                step: "Check if user exists",
                error: err,
            })
        }

        // save password encrypted
        const saveUser: UserType = {...defaultUser, ...user, password: generateHash(user.password)};

        // save user
        try {
            await modelUser.create(saveUser);
        } catch (err) {
            return res.status(500).json({
                status: 1, 
                step: "Save user",
                error: err,
            })
        }

        return res.json({
            status: 0,
            message: "Created successfully"
        });
    }
);

export {router as SignUp};