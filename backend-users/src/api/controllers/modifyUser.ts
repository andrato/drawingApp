import { Request, Response} from "express";
import { body, param, validationResult } from "express-validator";
import {modelUserInfo} from "../../mongo_schema";
import { UserType } from "../helpers/types";

export const getModifyFiltersChainValidation = [
    body("userId")
      .optional(false)
      .isString()
      .withMessage("Incorrect userId!"),
    body("firstName")
      .optional(true)
      .isString()
      .withMessage("Incorrect firstName!"),
    body("lastName")
      .optional(true)
      .isString()
      .withMessage("Incorrect lastName!"),
    body("about")
      .optional(true)
      .isString()
      .withMessage("Incorrect about!"),
];

export const modifyUser = async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            status: 1,
            errors: errors.array(),
        });
    }
    
    const {userId, firstName, lastName, about} = req.body;

    if (!firstName && !lastName && !about) {
        return res.status(400).json({message: "Nothing to change"})
    }

    const update = {
        firstName,
        lastName,
        "profile.about": about,
    }

    let existingUser: (UserType & {_id: string}| null);
    try {
        existingUser = await modelUserInfo.findByIdAndUpdate(userId, update);

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