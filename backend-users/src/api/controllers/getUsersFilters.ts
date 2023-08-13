import { Request, Response} from "express";
import { param, validationResult } from "express-validator";
import {modelUserInfo} from "../../mongo_schema";
import { UserType } from "../helpers/types";
import axios, { AxiosResponse } from "axios";

export const getUSersFiltersChainValidation = [
    param("sortBy")
      .optional()
      .isString()
      .withMessage("Incorrect sortBy!")
      .isIn(["newest", "oldest", "highRatings", "lowRatings", "reviewsUp", "reviewsDown"])
      .withMessage("sortBy value is invalid!"),
    param("userId")
      .optional()
      .isString()
      .withMessage("Incorrect userId!"),
    param("startDate")
      .optional()
      .isDecimal()
      .withMessage("Incorrect startDate!"),
    param("endDate")
      .optional()
      .isDecimal()
      .withMessage("Incorrect endDate!"),
];

type Drawing = {
    id: string; 
    userId: string;
    rating: number; 
    reviews: number;
}

/* 
 * Given the fact that there are lots of request to be made
 * in order to get the info needed =>
 * all the info will be provided and the client will do the sorting.
 * The users don't get so many updates, so it should be fine until next time visiting the page
**/
export const getUsersFilters = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            errors: errors.array(),
        });
    }

    const {sortBy, startDate, endDate, userId} = req.query;

    const created = {
        ...(startDate ? {$gte: startDate} : {}), 
        ...(endDate ? {$lte: endDate} : {}),
    }

    const searchUsers = {
        ...(startDate || endDate ? {created: created} : {}),
        ...(userId ? {userId} : {}),
    }

    let users: (UserType & {_id: string})[];
    // find user in DB
    try {
        users = await modelUserInfo.find();

    } catch (err) {
        return res.status(500).json({
            error: "An error occured! Please try again later",
        })
    }

    const promisesDrawings = users.map((user) => 
        axios.get('http://backend-drawings:8003/', { params: {userId: user?._id}})
    );

    let response: AxiosResponse<any, any>[]
    try {
        response = await Promise.all(promisesDrawings);        
    } catch (err) {
        return res.status(500).json({
            error: "Error occurred for drawings",
            err,
        })
    }

    const filteredUsers = response?.length ? users.map((user, index) => {
        const drawings = response[index].data.drawings as Drawing[];

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

        return {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            profile: user.profile ?? null,
            email: user.email,
            created: user.created,
            lastUpdated: user.lastUpdated,
            drawings: user.drawings,
            rating: sumRatings / ratings,
            reviews: noOfReviews,
        }
    }) : users;

    return res.status(200).json({
        users: filteredUsers,
    });
}
