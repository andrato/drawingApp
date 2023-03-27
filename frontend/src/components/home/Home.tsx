import { Box } from "@mui/material"
import { Page } from "../common/Page"
import { homeSizes, homeColors } from "./constants"
import { HomeCategory } from "./HomeCategory";

const categories = ["Top Art", "Top Amateur", "Gallery"];

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