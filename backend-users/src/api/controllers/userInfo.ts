import { Request, Response} from "express";
import {modelUserInfo} from "../../mongo_schema";
import { UserType } from "../helpers/types";
import { validationResult } from "express-validator";
import axios from "axios";

export const userInfoSchema = {
    userId: {
        isLength: {
            errorMessage: 'userId param missing!',
            options: { min: 1 },
            location: "params",
        },
    },
}

type Drawing = {
    id: string; 
    rating: number; 
    reviews: number;
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

    let drawings: Drawing[] = [];
    try {
        const drawingsResult = await axios.get<{status: 0 | 1; drawings: any[]}>('http://backend-drawings:8003/', { params: {userId: userId}});
        
        drawings = (drawingsResult.data.drawings ?? []) as Drawing[];

        if (!drawingsResult.data) {
            console.log("No drawing result");
        }
    } catch (err) {
        return res.status(500).json({
            status: 1, 
            error: "Error on getting drawings",
        })
    }

    let sumRatings: number = 0, 
        noOfReviews: number = 0,
        ratings = 0;

    drawings.forEach((drawing) => {
        if (drawing.rating) {
            sumRatings += drawing.rating;
            noOfReviews += drawing.reviews;
            ratings++;
        }
    });

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
            drawings: existingUser.drawings,
            rating: sumRatings / ratings,
            reviews: noOfReviews,
        },
    });
};