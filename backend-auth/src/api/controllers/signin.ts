import { Request, Response} from "express";
import jwt from "jsonwebtoken";
import { comparePassword } from "../helpers/helpers";
import {modelUserAuth, modelUserInfo} from "../../mongo_schema";
import { UserAuthType, UserInfoType } from "../helpers/types";
import { validationResult } from "express-validator";

export const signInSchema = {
    email: {
        isEmail: { 
            errorMessage: 'Email is wrong or missing!',
            bail: true, 
            location: "params",
        }
    },
    password: {
        isLength: {
            errorMessage: 'Password is wrong or missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}

export const signin = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: 1,
            errors: errors.array(),
        });
    }
    
    const user = {
        email: req.query.email as string,
        password: req.query.password as string,
    }
    
    let existingAuthUser: (UserAuthType & {_id: string}| null);

    // find user in DB
    try {
        existingAuthUser = await modelUserAuth.findOne({email: user.email});

        if (!existingAuthUser || (!comparePassword(user.password, existingAuthUser.password))) {
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

    let existingUser: (UserInfoType & {_id: string}| null);
    try {
        existingUser = await modelUserInfo.findOne({email: user.email});

        if (!existingUser) {
            console.log("an error occured with the existing user info")
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
            id: existingUser?._id,
            firstName: existingUser?.firstName,
            lastName: existingUser?.lastName,
            profile: existingUser?.profile ?? null,
            email: existingUser?.email ?? existingAuthUser.email,
            created: existingUser?.created ?? existingAuthUser.created,
            lastUpdated: existingUser?.lastUpdated ?? existingAuthUser.lastUpdated,
            isAdmin: existingAuthUser.isAdmin,
        },
    });
}