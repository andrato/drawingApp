import { Box } from "@mui/material"
import { ReactNode } from "react";


export const Page = ({
    children, 
    hasMarginX = false,
    hasMarginY = true,
} : {
    children: ReactNode;
    hasMarginX?: boolean;
    hasMarginY?: boolean;
}) => {
    return (
        <Box sx={{
            width: hasMarginX ? "calc(100% - 32px)" : "100%",
            height: hasMarginY ? "calc(100% - 58px - 32px)" : "100%",
            ...(hasMarginY ? {my: 2} : {}),
            ...(hasMarginX ? {mx: 2} : {}),
        }}> 
            {children}
        </Box>
    );
}