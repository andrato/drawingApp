import { Box, Card, CardMedia, Typography } from "@mui/material";
import { navColors } from "../header/constants";
import { homeColors } from "./constants";
import imgTest from "../../assets/1.png";
import { height } from "@mui/system";


const dataToTest = [{
    id: 1,
    img: imgTest,
},
{
    id: 2,
    img: imgTest,
},
{
    id: 3,
    img: imgTest,
},
{
    id: 4,
    img: imgTest,
},
{
    id: 5,
    img: imgTest,
},
{
    id: 6,
    img: imgTest,
},
{
    id: 7,
    img: imgTest,
},
{
    id: 8,
    img: imgTest,
},
{
    id: 9,
    img: imgTest,
},
{
    id: 1,
    img: imgTest,
},
{
    id: 10,
    img: imgTest,
},
{
    id: 11,
    img: imgTest,
},
{
    id: 12,
    img: imgTest,
},]

export const HomeCategory = ({
    category,
}: {
    category: string;
}) => {
    return (
        <Box sx={{
            bgcolor: homeColors.backgound, 
            height: "31%",
        }}>
            <Box sx={{
                m: 1,
                mx: 4,
                height: "calc(100% - 16px)"
            }}>
                <Typography color={navColors.textNav}>
                    {category}
                </Typography>
                <Box sx={{
                    height: "calc(100% - 24px)",
                    width: "100%",
                    display: "flex", 
                    overflow: "scroll",
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