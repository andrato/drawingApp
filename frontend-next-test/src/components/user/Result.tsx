import { Typography } from "@mui/material";
import { DialogUser } from "./DialogUser";
import { Step } from "./utils";

export const Result = (props: {
    open: boolean;
    step: Step | null;
    onHandleClose: () => void;
    onOpenSignUp: () => void;
    onOpenSignIn: () => void;
}) => {
    const {step, onOpenSignUp, onOpenSignIn, ...rest} = props;
    const title = step === Step.SUCCESS ? "SUCCESS" : "ERROR";

    if (null === step) {
        return null;
    }

    return <DialogUser {...rest} title={title}>  
        {step === Step.SUCCESS && <Typography variant="body1" sx={{textAlign: "center", py: 1}}>
                {"Successfully registered! You can now "}
                <Typography 
                    component="span" 
                    variant="body1"  
                    onClick={() => {props.onHandleClose(); onOpenSignIn()}}
                    sx={{
                        color: (theme) => theme.palette.primary.main,
                        fontWeight: "bold",
                        ":hover": {
                            cursor: "pointer",
                        }
                    }}
                > 
                    {"Sign in"}
                </Typography> 
                {" to your account!"}
            </Typography>}
        {step === Step.ERROR && <Typography variant="body1" sx={{textAlign: "center", py: 1}}>
                {"Error at signup! "}
                <Typography 
                    component="span" 
                    variant="body1"  
                    onClick={() => {props.onHandleClose(); onOpenSignUp()}}
                    sx={{
                        color: (theme) => theme.palette.primary.main,
                        fontWeight: "bold",
                        ":hover": {
                            cursor: "pointer",
                        }
                    }}
                > 
                    {"Try again!"}
                </Typography> 
            </Typography>}
    </DialogUser>
}