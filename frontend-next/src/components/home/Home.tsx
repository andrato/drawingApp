import { Box } from "@mui/material"
import { categories } from "../common/constants";
import { HomeCategory } from "./HomeCategory";
import { Page } from "@/components/utils/helpers/Page";

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
                       return  <HomeCategory key={category} category={category} />
                    })
                }
            </Box>
        </Page>
    )
}