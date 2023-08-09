import { Request, Response} from "express";
import {modelUserAuth, modelUserInfo} from "../../mongo_schema";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import axios from "axios";

export const deleteUserSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId is wrong or missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}

export const deleteUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: 1,
            errors: errors.array(),
        });
    }
    
    const userId = req.query.userId as string;
    const mongoId = new Types.ObjectId(userId);

    try {
        await axios.post("http://backend-drawings:8003/delete", {}, { params: {userId}});
    } catch (err) {
        return res.status(500).json({
            error: 'Error occured when trying to delete drawings!',
            err,
        })
    }

    try {
        await modelUserAuth.deleteOne({_id: mongoId});
    } catch (err) {
        return res.status(500).json({
            error: 'Some error occured when trying to delete user!',
        });
    }

    try {
        await modelUserInfo.deleteOne({_id: mongoId});

    } catch (err) {
        return res.status(500).json({
            error: "error occured when trying to delete user",
        })
    }
    
    return res.json();
}