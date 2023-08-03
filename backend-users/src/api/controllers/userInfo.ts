import { Request, Response} from "express";
import {modelUserInfo} from "../../mongo_schema";
import { UserType } from "../helpers/types";
import { validationResult } from "express-validator";

export const userInfoSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId param missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}

export const userInfo = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: 1,
            errors: errors.array(),
        });
    }
    
    const userId= req.query.userId as string;
    
    let existingUser: (UserType & {_id: string}| null);

    // find user in DB
    try {
        existingUser = await modelUserInfo.findById(userId);

        if(!existingUser) {
            return res.json({
                status: 1,
                user: null,
            });
        }
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: err,
        })
    }

    return res.json({
        status: 0,
        user: {
            id: existingUser._id,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            profile: existingUser.profile ?? null,
            email: existingUser.email,
            created: existingUser.created,
            lastUpdated: existingUser.lastUpdated,
        },
    });
};