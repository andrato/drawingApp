import { DialogUser } from "./DialogUser";
import { FormikBag, FormikHelpers, useFormik } from 'formik';
import { useRef } from "react";
import { SignUpSchema, SignUpValuesType, Step } from "./utils";
import { SignUpForm } from "./SignUpForm";
import { Typography } from "@mui/material";

export const SignUp = (props: {
    open: boolean;
    onHandleClose: (step?: Step) => void;
    onOpenSignIn: () => void
}) => {
    const values = useRef<SignUpValuesType>({firstName: "", lastName:"", email: "", password: ""});
    const handleSubmit = (values: SignUpValuesType, {resetForm}: FormikHelpers<SignUpValuesType>) => {
        // ToDo: send to backend and wait for the response

        // close modal and display error / success message
        resetForm();
        props.onHandleClose(Step.SUCCESS);
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