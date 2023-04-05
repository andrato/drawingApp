import { Box, CardMedia, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, useMediaQuery, useTheme } from "@mui/material";
import { Page } from "../../helpers/Page";
import { dataToTest } from "../common/testData";
import { navColors } from "../header/constants";
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { SortBy, sortByOptions } from "../common/constants";
import { filtersColors } from "./constants";

const useItemsPerPage = () => {
    const theme = useTheme();
    const isMediumScreenUp = useMediaQuery(theme.breakpoints.up('md'));
    const isSmallScreenUp = useMediaQuery(theme.breakpoints.up('sm'));

    if (isMediumScreenUp) {
        return 6 * 3;
    } else if (isSmallScreenUp) {
        return 4 * 3;
    }

    return 3 * 4;
}

export function TopArt() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [sortBy, setSortBy] = useState<SortBy>(SortBy.RECENT);
    const [itemsPage, setItemsPage] = useState<{id: number, img: string}[]>();
    const itemsPerPage = useItemsPerPage();
    const pageNumber = Number(searchParams.get("page")) ?? 1;
    const pages = Math.ceil(dataToTest.length / itemsPerPage);

    const computeItems = (pageNumber: number) => {
        pageNumber--;

        let indexStart = (itemsPerPage * pageNumber);

        if (indexStart) {
            indexStart--;
        }

        const indexEnd = indexStart + itemsPerPage;
        return dataToTest.slice(indexStart, indexEnd);
    }

    const handlePageChange = (event: any, value: number) => {
        setSearchParams({"page": String(value)});
    }

    useEffect(() => {
        const itemsAux = computeItems(pageNumber);
        setItemsPage(itemsAux);
    }, [itemsPerPage, pageNumber])


    return (
        <Page hasMarginX={true} sx={{
            display: "flex",
            flexDirection: "column", 
            justifyContent: "space-between",
        }}>
            <div>
                <Box>
                    <FormControl>
                    <InputLabel 
                        id="demo-simple-select-standard-label"
                        size="small"
                        sx={{
                            fontSize: "0.9rem",
                            color: navColors.textNav,
                            '&.Mui-focused': {
                                color: filtersColors.textFocus,
                                borderColor: filtersColors.textFocus,
                            }
                        }}
                    >Sort By
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        size="small"
                        variant="outlined"
                        // value={sortBy}
                        onChange={(event) => setSortBy(event.target.value as SortBy)}
                        label="Sort by"
                        color="success"
                        inputProps={{

                        }}
                        sx={{
                            bgcolor: filtersColors.backgoundInput,
                            mb: 3,
                            width: "180px",
                            fontSize: "0.9rem",
                            color: navColors.textNav,
                            'svg': {
                                color: navColors.textNav,
                            },
                        }}
                    >
                        {sortByOptions.map((option) => {
                            return <MenuItem value={option} sx={{fontSize: "0.9rem"}}>{option}</MenuItem>
                        })}
                    </Select>
                    </FormControl>
                </Box>
                
                <Grid container spacing={1} sx={{
                    mb: 2,
                }}>
                    {itemsPage?.length && itemsPage.map((item) => {
                        return (
                            <Grid item md={2} sm={3} xs={4}>
                                <CardMedia
                                    component="img"
                                    image={item.img}
                                    alt="Paella dish"
                                    sx={{
                                        mr: 1,
                                        position: "relative",
                                    }}
                                />
                            </Grid>
                        )
                    })};
                </Grid>
            </div>
            <Pagination count={pages} 
                showFirstButton 
                showLastButton 
                defaultPage={pageNumber}
                onChange={handlePageChange}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 1,
                    '&.MuiPagination-root': {
                        mb: 1,
                    },
                    '.MuiPaginationItem-root': {
                        color: navColors.textNav,

                        ':selected': {
                            backgroundColor: "#d7d7d7", // ToDo: try change color
                        } 
                    },
                }} 
            />
        </Page>
    )
}