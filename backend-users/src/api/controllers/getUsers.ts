import { Request, Response} from "express";
import {modelUserInfo} from "../../mongo_schema";
import { UserType } from "../helpers/types";
import { validationResult } from "express-validator";
import axios from "axios";

export const getUsers = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: 1,
            errors: errors.array(),
        });
    }
            
    let users: (UserType & {_id: string}| null)[];

    // find user in DB
    try {
        users = await modelUserInfo.find();

    } catch (err) {
        return res.status(500).json({
            error: "An error occured! Please try again later",
        })
    }

    return res.json({
        users: users
    });
}
