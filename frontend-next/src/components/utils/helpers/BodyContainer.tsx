import { Box } from "@mui/material";
import React from "react";

export const BodyContainer = ({children} : {children:React.ReactNode}) => {
    return (<Box sx={{
        p: 3,
    }}>
        {children}
    </Box>)
}