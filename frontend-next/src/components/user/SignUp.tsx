import { DialogUser } from "./DialogUser";
import { FormikBag, FormikHelpers, useFormik } from 'formik';
import { useRef } from "react";
import { SignUpSchema, SignUpValuesType, Step } from "./utils";
import { SignUpForm } from "./SignUpForm";
import { Typography } from "@mui/material";
import { signUp } from "@/services/Auth";

export const SignUp = (props: {
    open: boolean;
    onHandleClose: (step?: Step) => void;
    onOpenSignIn: () => void
}) => {
    const values = useRef<SignUpValuesType>({firstName: "", lastName:"", email: "", password: ""});
    const handleSubmit = async (values: SignUpValuesType, {resetForm}: FormikHelpers<SignUpValuesType>) => {
        // ToDo: send to backend and wait for the response
        console.log(values);
        try {
            const {data} = await signUp(values);

            if (data.status && data.error) {
                console.log("error");
                props.onHandleClose(Step.ERROR);
            }

            if (!data.status) {
                resetForm();
                props.onHandleClose(Step.SUCCESS);
            }
        } catch (err: any) {
            console.error("Error is: " + JSON.stringify(err));
            props.onHandleClose(Step.ERROR);
        }

        // close modal and display error / success message
    }
    const formik = useFormik({
        initialValues: values.current,
        validationSchema: SignUpSchema,
        onSubmit: handleSubmit,
        validateOnBlur: true,
    })

    const handleClose = () => {
        formik.resetForm();
        props.onHandleClose();
    }

    return (
        <DialogUser onHandleClose={handleClose} open={props.open} title="Sign up">    
            <form auto-complete="off" onSubmit={formik.handleSubmit}>
                <SignUpForm 
                    values={formik.values}
                    errors={formik.errors}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched}
                    isSubmitting={formik.isSubmitting}
                />
            </form>    
            <Typography variant="body2" sx={{textAlign: "center", py: 1}}>
                {"If you already have an account, you can "}
                <Typography 
                    component="span" 
                    variant="body2"  
                    onClick={props.onOpenSignIn}
                    sx={{
                        color: (theme) => theme.palette.primary.main,
                        fontWeight: "bold",
                        ":hover": {
                            cursor: "pointer",
                        }
                    }}
                > 
                    {"sign in"}
                </Typography> 
                {" here!"}
            </Typography>        
        </DialogUser>
    )
}