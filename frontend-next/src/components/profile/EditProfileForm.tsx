import { Box, Button, TextField, TextFieldProps } from "@mui/material";
import { FormikErrors, FormikTouched } from 'formik';
import { EditProfileValuesType, getIsValid } from "./utils";

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

export const EditProfileForm = ({ 
    values,
    errors,
    onChange,
    onBlur,
    touched,
    isSubmitting,
} : {
    values: EditProfileValuesType;
    errors: FormikErrors<EditProfileValuesType>;
    onChange: (e: React.ChangeEvent<any>) => void;
    onBlur: (e: React.ChangeEvent<any>) => void;
    touched: FormikTouched<EditProfileValuesType>;
    isSubmitting: boolean;
}) => {
    const canContinue = getIsValid(values);

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
            label={"About"}
            error={Boolean(errors.firstName) && Boolean(touched.firstName)}
            helperText={errors.firstName}
            defaultValue={values["about"]}
            multiline
            minRows={2}
            InputProps={{
                name: "about",
                type: "about",
                onChange,
                onBlur,
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