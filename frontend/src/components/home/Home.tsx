import { Box } from "@mui/material"
import { categories } from "../common/constants";
import { Page } from "../../helpers/Page"
import { HomeCategory } from "./HomeCategory";

export const Home = () => {
    return (
        <Page>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                width: "100%",
                justifyContent:"space-around",
            }}>
                {
                    categories.map((category) => {
                       return  <HomeCategory category={category} />
                    })
                }
            </Box>
        </Page>
    )
}