import { UserType } from "@/services/User";
import { Avatar, Box, Card, CardMedia, Paper, Typography } from "@mui/material";

// const USER_CARD_HEIGHT = 110;

const DEFAULT_IMAGE = "https://drawings-media.fra1.cdn.digitaloceanspaces.com/default_avatars/alien.png";

export const User = (props: UserType & {onClick: (id: string) => void}) => {
    const {_id, firstName, lastName, created, rating, reviews, imgLocation, drawings, onClick} = props;
    const initials = firstName[0] + lastName[0];

    return <Card 
    onClick={() => onClick(_id)}
    sx={(theme) => ({ 
        display: 'flex',
        justifyContent: "space-between",
        bgcolor: theme.palette.backgroundCustom.profileInfo,
        color: theme.palette.textCustom.primary,
        p: 1,
        gap: 1,
        ':hover': { 
            bgcolor: theme.palette.backgroundCustom.hover,
            cursor: "pointer"
        }
    })}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body1" sx={{
                mb: 1,
            }}>
                {firstName + " " + lastName}
            </Typography>
            <Typography variant="body2">
                <strong>{"Drawings: "}</strong>
                {drawings ?? 0}
            </Typography>
            <Typography variant="body2">
                <strong>{"Rating: "}</strong>
                {rating ?? "-"}
            </Typography>
            <Typography variant="body2">
                <strong>{"Reviews: "}</strong>
                {reviews ?? "-"}
            </Typography>
            <Typography variant="body2">
                <strong>{"Member since: "}</strong>
                {created ? (new Date(created)).toDateString() : "-"}
            </Typography>
        </Box>
        {imgLocation 
            ? <CardMedia
                component="img"
                sx={{ width: 151, my: "-8px", mr: "-8px"}}
                image={imgLocation ?? DEFAULT_IMAGE}
                alt="Live from space album cover"
            /> : <Box sx={(theme) => ({
                bgcolor: "#aadeffbf",
                width: 151,
                my: "-8px", mr: "-8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            })}>
                <Typography variant="body1" sx={(theme) => ({
                    color: theme.palette.backgroundCustom.main,
                })}>
                    {initials}
                </Typography>
            </Box>}
    </Card>
}