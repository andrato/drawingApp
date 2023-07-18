import { SyntheticEvent, useState } from "react";
import { getUserInfo, isSameUser } from "../common/helpers";
import { Rating } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
// import { RatingType, RatingsType, postRating } from "@/services/CommentsAndRatings";

export const RatingDrawing = ({ratingNumber, userId}: {ratingNumber?: number; userId: string}) => {
    const [value, setValue] = useState<number | null>(0);
    // const {mutate: addRating, isLoading, isSuccess} = useMutation({
    //     mutationFn: (data: {rating: number, drawingId: string}) => {
    //       return postRating(data);
    //     },
    //     onError: (error, variables, context) => {
    //         // An error happened!
    //         console.log("An error occured");
    //     },
    //     onSuccess: (data, variables, context) => {
    //     },
    // })

    const handleChangeRating = (event: SyntheticEvent<Element, Event>, newValue: number | null) => {
        setValue(newValue);
    }

    return <Rating
        value={value}
        onChange={handleChangeRating}
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