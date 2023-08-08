import { Request, Response} from "express";
import {modelUserAuth, modelUserInfo} from "../../mongo_schema";
import { UserAuthType, UserInfoType } from "../helpers/types";
import { validationResult } from "express-validator";

export const modifyAdminSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId is wrong or missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}

export const modifyAdmin = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: 1,
            errors: errors.array(),
        });
    }
    
    const userId = req.query.userId;

    console.log("ajung aici");

    let existingAuthUser: (UserAuthType & {_id: string}| null);

    // find user in DB
    try {
        existingAuthUser = await modelUserAuth.findByIdAndUpdate(userId, [{ $set: { isAdmin: { $not: "$isAdmin" }}}]);

        console.log("ajung aici");

        if (!existingAuthUser) {
            return res.status(500).json({
                error:  "User does not exist!"
            })
        }
    } catch (err) {
        return res.status(500).json({
            error: 'Some error occured! Please try again later!',
        })
    }

    let existingUser: (UserInfoType & {_id: string}| null);
    try {
        existingUser = await modelUserInfo.findByIdAndUpdate(userId, [{$set: { isAdmin: { $not: "$isAdmin" }}}]);

        if (!existingUser) {
            console.log("an error occured while trying to update the existing user info")
        }
    } catch (err) {
        return res.status(500).json({
            error: "error occured when trying to update users",
        })
    }
    
    return res.json();
}