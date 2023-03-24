import { DialogUser } from "./DialogUser";
import { FormikHelpers, useFormik } from 'formik';
import { useRef } from "react";
import { SigninSchema, SignInValuesType } from "./utils";
import { SignInForm } from "./SignInForm";
import { Typography } from "@mui/material";

export const SignIn = (props: {
    open: boolean;
    onHandleClose: () => void;
    onOpenSignup: () => void;
}) => {
    const values = useRef<SignInValuesType>({email: "", password: ""});
    const handleSubmit = (values: SignInValuesType, {resetForm}: FormikHelpers<SignInValuesType>) => {
        resetForm();
        props.onHandleClose();
    }
    const formik = useFormik({
        initialValues: values.current,
        validationSchema: SigninSchema,
        onSubmit: handleSubmit,
        validateOnBlur: true,
    })

    const handleClose = () => {
        formik.resetForm();
        props.onHandleClose();
    }
 
    return (
        <DialogUser onHandleClose={handleClose} open={props.open} title="Sign in">    
            <form auto-complete="off" onSubmit={formik.handleSubmit}>
                <SignInForm 
                    values={formik.values}
                    errors={formik.errors}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    touched={formik.touched}
                    isSubmitting={formik.isSubmitting}
                />
            </form>
            <Typography variant="body2" sx={{textAlign: "center", py: 1}}>
                You don't have an account?{" "}
                <Typography 
                    component="span" 
                    variant="body2"  
                    onClick={props.onOpenSignup}
                    sx={{
                        color: (theme) => theme.palette.primary.main,
                        fontWeight: "bold",
                        ":hover": {
                            cursor: "pointer",
                        }
                    }}
                > 
                    Sign up!
                </Typography> 
            </Typography>
        </DialogUser>
    )
}