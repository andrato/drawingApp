import { Box, BoxProps } from "@mui/material"
import { ReactNode } from "react";

export const Page = ({
    children, 
    hasMarginX = false,
    hasMarginY = true,
    ...props
} : {
    children: ReactNode;
    hasMarginX?: boolean;
    hasMarginY?: boolean;
} & BoxProps) => {
    const {sx, ...restProps} = props;

    return (
        <Box 
            {...restProps}
            sx={{
                ...(sx ? sx : {}),
                width: hasMarginX ? "calc(100% - 32px)" : "100%",
                height: hasMarginY ? "calc(100% - 58px - 32px)" : "100%",
                overflow: "scroll",
                ...(hasMarginY ? {py: 2} : {}),
                ...(hasMarginX ? {px: 2} : {}),
            }}
        > 
            {children}
        </Box>
    );
}