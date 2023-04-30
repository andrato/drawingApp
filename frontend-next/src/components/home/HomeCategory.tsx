import { Box, CardMedia, Typography } from "@mui/material";
import { dataToTest } from "../common/testData";

export const HomeCategory = ({
    category,
}: {
    category: string;
}) => {
    return (
        <Box sx={(theme) => ({
            bgcolor: theme.palette.backgroundCustom.dark,
            height: "31%",
        })}>
            <Box sx={{
                m: 1,
                mx: 4,
                height: "calc(100% - 16px)"
            }}>
                <Typography sx={(theme) => ({color: theme.palette.textCustom.primary})}>
                    {category}
                </Typography>
                <Box sx={{
                    height: "calc(100% - 24px)",
                    width: "100%",
                    display: "flex", 
                    overflow: "scroll",
                    "::-webkit-scrollbar": {
                        display: "none",
                    },
                    alignItems: "center"
                }}>
                    {dataToTest.map((item) => {
                        return (
                            <CardMedia
                                component="img"
                                height="80%"
                                width="100%"
                                image={item.img}
                                alt="Paella dish"
                                sx={{
                                    mr: 1,
                                    transition: "all .2s ease-in-out", 
                                    position: "relative",
                                    ":hover" : {
                                        transform: "scale(1.2)",
                                        zIndex: 1,
                                    }
                                }}
                            />
                        )
                    })};
                </Box>
            </Box>
        </Box>
    );
}