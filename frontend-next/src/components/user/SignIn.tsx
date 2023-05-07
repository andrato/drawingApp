import { DialogUser } from "./DialogUser";
import { FormikHelpers, useFormik } from 'formik';
import { useRef, useState } from "react";
import { SigninSchema, SignInValuesType } from "./utils";
import { SignInForm } from "./SignInForm";
import { Typography } from "@mui/material";
import { signIn } from "../../services/Auth";
import { LocalStorageKeys } from "@/components/utils/constants/LocalStorage";

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

            if (data.status && data.error) {
                setError(data.error)
            }

            if (!data.status) {
                const userInfo = {
                    id: data.user.id,
                    email: data.user.email,
                    firstName: data.user.firstName,
                    lastName: data.user.lastName,
                };

                localStorage.setItem(LocalStorageKeys.USER_TOKEN, data.accessToken);
                localStorage.setItem(LocalStorageKeys.USER_INFO, JSON.stringify(userInfo));
                resetForm();
                props.onHandleClose();
                window.location.reload();
            }
        } catch (err: any) {
            console.error("Error is: " + JSON.stringify(err));
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