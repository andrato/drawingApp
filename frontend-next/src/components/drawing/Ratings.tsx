import { useState } from "react";
import { isSameUser } from "../common/helpers";
import { Rating } from "@mui/material";

export const Ratings = ({ratingNumber, userId}: {ratingNumber?: number; userId: string}) => {
    const [value, setValue] = useState<number | null>(0);

    return <Rating
        value={value}
        onChange={(event, newValue) => {
            setValue(newValue);
        }}
        precision={0.5}
        disabled={isSameUser(userId)}
        sx={(theme) => ({
            'svg': {
                color: theme.palette.backgroundCustom.star,
            },
            'label': {
                fontSize: "27px",
            }
        })}
    />
}