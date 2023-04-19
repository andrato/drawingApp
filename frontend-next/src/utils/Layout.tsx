import { ReactNode } from "react";
import { Navbar } from "../components/header/Navbar";
import { Box } from "@mui/material";

export const Layout = ({children}: {children: ReactNode}) => {
    return <Box sx={{
        width: "100%",
        height: "100%",
    }}>
        <Navbar/>
        {children}
    </Box>
}