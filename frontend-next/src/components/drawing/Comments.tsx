import { Button, Paper, TextField, Typography } from "@mui/material";
import { isUserLoggedIn } from "../common/helpers";

export const Comments = ({drawingId}: {drawingId: string}) => {
    const userLogged = isUserLoggedIn(); 

    const handlePost = () => {
        
    }

    return <Paper elevation={2} sx={(theme) => ({
        mt: 1,
        p: 2,
        bgcolor: theme.palette.backgroundCustom.light,
        color: theme.palette.textCustom.primary,
    })}>
        {userLogged ? <>
            <TextField
            id="outlined-multiline-flexible"
            multiline
            maxRows={10}
            sx={(theme) => ({
                width: "100%",
                bgcolor: theme.palette.backgroundCustom.main,
                '.MuiInputBase-input': {
                    color: theme.palette.textCustom.primary,
                }
            })}
            />
            <Button 
                variant="contained" 
                size="medium" 
                // onClick={() => setOpenSignIn()}
                sx={(theme) => ({
                    mt: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.backgroundCustom.main,
                    fontWeight: "bold",
                    // fontSize: theme.customSizes.fontSizeButtonsText,
                    textTransform: 'none',
                    ':hover': {
                        backgroundColor: theme.palette.primary.light,
                    },
                    // p: "3px 12px",
                    display: "block", 
                    float: "right"
                })}
            >
                Post comment
            </Button>
        </> : 
            <Typography>
                You must be logged in to post a comment!
            </Typography>
        }
    </Paper>;
}