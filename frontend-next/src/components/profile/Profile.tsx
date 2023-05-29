import { Page } from "@/components/utils/helpers/Page";
import { ProfileNav } from "./ProfileNav";
import { ReactNode} from "react";
import { Box } from "@mui/material";

export const Profile = ({children} : {children: ReactNode}) => {
    return (<Page hasMarginY={false}>
        <Box sx={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
            width: "100%",
        }}>
            <ProfileNav />
            {children}
        </Box>
    </Page>);
}