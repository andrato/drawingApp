

import { Box, Button, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, TextFieldProps, Theme, Typography, useTheme } from "@mui/material";
import { FormikErrors, FormikTouched } from 'formik';
import { getIsValid, SaveValuesType } from "./utils";
import { ReactNode } from "react";

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

export const SaveValuesForm = ({ 
    values,
    errors,
    onChange,
    onBlur,
    setFieldValue,
    touched,
    isSubmitting,
    errorRequest,
} : {
    values: SaveValuesType;
    errors: FormikErrors<SaveValuesType>;
    onChange: (e: (React.ChangeEvent<any> | SelectChangeEvent<string[]>), child?: ReactNode) => void;
    onBlur: (e: React.FocusEvent<any>) => void;
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    touched: FormikTouched<SaveValuesType>;
    isSubmitting: boolean;
    errorRequest?: string | null;
} ) => {
    const canContinue = getIsValid(values);
    const theme = useTheme();

    const categories = [
        "Sport",
        "Digital Art",
        "Nature",
        "Portrait",
        "Traditional Art",
    ]

    return <Box sx={{
        mt:2
    }}>
        <TextFieldStyled 
            label={"Title"}
            error={Boolean(errors.title) && Boolean(touched.title)}
            helperText={errors.title}
            defaultValue={values["displayTitle"]}
            InputProps={{
                name: "displayTitle",
                type: "text",
                onChange,
                onBlur,
            }}
        />
        <TextFieldStyled 
            label={"File Name"}
            error={Boolean(errors.title) && Boolean(touched.title)}
            helperText={errors.title}
            defaultValue={values["title"]}
            disabled
            InputProps={{
                name: "title",
                type: "text",
                onChange,
                onBlur,
            }}
        />
        <TextFieldStyled 
            label={"Description"}
            multiline
            error={Boolean(errors.title) && Boolean(touched.title)}
            helperText={errors.title}
            defaultValue={values["description"]}
            InputProps={{
                name: "description",
                type: "text",
                onChange,
                onBlur,
            }}
        />
        <FormControl sx={{ width: "100%", mb: 2 }}>
            <InputLabel id="demo-multiple-chip-label">Select category</InputLabel>
            <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={values["categories"]}
                onChange={(event) => {
                    const {
                        target: { value },
                    } = event;
              
                    setFieldValue("categories", value);
                }}
                input={<OutlinedInput id="select-multiple-chip" label="Select category" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                        <Chip key={value} label={value} />
                    ))}
                    </Box>
                )}
            MenuProps={MenuProps}
            >
                {categories.map((name) => (
                    <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, values.categories, theme)}
                    >
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        {errorRequest && <Typography variant="body2" color="error" sx={{pb: 1}}>
            {errorRequest}
        </Typography>}
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
            Publish
        </Button>
    </Box>
};