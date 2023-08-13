import { UserType } from "@/services/User";
import { Avatar, Box, Card, CardMedia, Paper, Typography } from "@mui/material";

// const USER_CARD_HEIGHT = 110;

const DEFAULT_IMAGE = "https://drawings-media.fra1.cdn.digitaloceanspaces.com/default_avatars/alien.png";

export const User = (props: UserType) => {
    const {firstName, lastName, created, rating, reviews, imgLocation, drawings} = props;
    const initials = firstName[0] + lastName[0];

    return <Card sx={(theme) => ({ 
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
            })}>
                <Typography variant="body1" sx={(theme) => ({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: theme.palette.backgroundCustom.main,
                })}>
                    {initials}
                </Typography>
            </Box>}
    </Card>
    
    
    
    
    
    // <Paper sx={(theme) => ({
    //     bgcolor: theme.palette.backgroundCustom.profileInfo,
    //     p: 2,
    //     display: "flex",
    //     flexDirection: "row",
    //     gap: 1,
    //     // height: USER_CARD_HEIGHT,
    // })}>
    //     <Box sx={(theme) => ({
    //         width: "130px",
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "center",
    //         color: theme.palette.textCustom.primary,
    //     })}>
    //         <Avatar
    //             alt={initials}
    //             src="/static/images/avatar/1.jpg"
    //             sx={{ width: 50, height: 50 }}
    //         >
    //             {initials}
    //         </Avatar>
    //         <Typography variant="body1" sx={{
    //             mt: 2,
    //         }}>
    //             {firstName + " " + lastName}
    //         </Typography>
    //     </Box>
    //     <Box sx={(theme) => ({
    //             display: "flex",
    //             flexDirection: "column",
    //             color: theme.palette.textCustom.primary,
    //             gap: 1,
    //         })}>
    //             <Typography variant="body2">
    //                 <strong>{"Member since: "}</strong>
    //                 {created ? (new Date(created)).toDateString() : "-"}
    //             </Typography>
    //             <Typography variant="body2">
    //                 <strong>{"Rating: "}</strong>
    //                 {rating ?? "-"}
    //             </Typography>
    //             <Typography variant="body2">
    //                 <strong>{"Reviews: "}</strong>
    //                 {reviews ?? "-"}
    //             </Typography>
    //         </Box>
    // </Paper>
}