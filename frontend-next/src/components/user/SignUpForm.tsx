import { Box, Button, IconButton, InputAdornment, TextField, TextFieldProps, Theme, Typography } from "@mui/material";
import { FormikErrors, FormikTouched } from 'formik';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { getIsValid, SignUpValuesType, Step } from "./utils";

const TextFieldStyled = (props: TextFieldProps) => {
    return <TextField 
        label="Outlined" 
        variant="outlined" 
        size="small"
        sx={{
            width: "100%",
            mb: 3,
        }}
        {...props}
        
    />
}

export const SignUpForm = ({ 
    values,
    errors,
    onChange,
    onBlur,
    touched,
    isSubmitting,
} : {
    values: SignUpValuesType;
    errors: FormikErrors<SignUpValuesType>;
    onChange: (e: React.ChangeEvent<any>) => void;
    onBlur: (e: React.ChangeEvent<any>) => void;
    touched: FormikTouched<SignUpValuesType>;
    isSubmitting: boolean;
}) => {
    const canContinue = getIsValid(values, Step.SIGNUP);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return <Box sx={{
        mt:2
    }}>
        <TextFieldStyled 
            label={"First Name"}
            error={Boolean(errors.firstName) && Boolean(touched.firstName)}
            helperText={errors.firstName}
            defaultValue={values["firstName"]}
            InputProps={{
                name: "firstName",
                type: "firstName",
                onChange,
                onBlur,
            }}
        />
        <TextFieldStyled 
            label={"Last Name"}
            error={Boolean(errors.firstName) && Boolean(touched.firstName)}
            helperText={errors.firstName}
            defaultValue={values["lastName"]}
            InputProps={{
                name: "lastName",
                type: "lastName",
                onChange,
                onBlur,
            }}
        />
        <TextFieldStyled 
            label={"Email"}
            error={Boolean(errors.email) && Boolean(touched.email)}
            helperText={errors.email}
            defaultValue={values["email"]}
            InputProps={{
                name: "email",
                type: "email",
                onChange,
                onBlur,
            }}
        />
        <TextFieldStyled 
            label="Password"
            error={Boolean(errors.password) && Boolean(touched.password)}
            helperText={errors.password}
            defaultValue={values["password"]}
            InputProps = {{
                name: "password",
                type: showPassword ? "text" : "password",
                onChange,
                onBlur,
                endAdornment:
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>,
            }}
        />
        <Button 
            type="submit" 
            disabled={!canContinue || isSubmitting}
            variant="contained"
            color={"success"}
            sx={{
                my: 1,
                display: "flex",
                width: "100%",
            }}
        >
            Submit
        </Button>
    </Box>
};