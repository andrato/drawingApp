import { DialogUser } from "./DialogUser";
import { FormikHelpers, useFormik } from 'formik';
import { useRef, useState } from "react";
import { SigninSchema, SignInValuesType } from "./utils";
import { SignInForm } from "./SignInForm";
import { Typography } from "@mui/material";
import { signIn } from "../../services/Auth";
import { LocalStorageKeys } from "@/utils/constants/LocalStorage";

export const SignIn = (props: {
    open: boolean;
    onHandleClose: () => void;
    onOpenSignup: () => void;
}) => {
    const values = useRef<SignInValuesType>({email: "", password: ""});
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: SignInValuesType, {resetForm}: FormikHelpers<SignInValuesType>) => {
        try {
            const {data} = await signIn({email: values.email, password: values.password});
            console.log("Response is: ");
            console.log(data);

            if (data.status && data.error) {
                setError(data.error)
            }

            if (!data.status) {
                localStorage.setItem(LocalStorageKeys.USER_TOKEN, data.accessToken);
                resetForm();
                props.onHandleClose();
            }
        } catch (errors: any) {
            console.log("Error is: ");
            console.log(errors);
        }
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
                    errorRequest={error}
                />
            </form>
            <Typography variant="body2" sx={{textAlign: "center", py: 1}}>
                {"You don't have an account? "}
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
                    {"Sign up!"}
                </Typography> 
            </Typography>
        </DialogUser>
    )
}