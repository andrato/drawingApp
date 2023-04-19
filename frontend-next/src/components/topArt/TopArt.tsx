import { Box, CardMedia, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, useMediaQuery, useTheme } from "@mui/material";
import { dataToTest } from "../common/testData";
import { useEffect, useState } from "react";
import { SortBy, sortByOptions } from "../common/constants";
import { filtersColors } from "./constants";
import { Page } from "@/utils/helpers/Page";
import { useRouter } from "next/router";

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
    // const [searchParams, setSearchParams] = useSearchParams();
    const router = useRouter();
    const [sortBy, setSortBy] = useState<SortBy>(SortBy.RECENT);
    const [itemsPage, setItemsPage] = useState<{id: number, img: string}[]>();
    const itemsPerPage = useItemsPerPage();
    const pageNumber = Number(router.query["page"] ?? null) ?? 1;
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
        router.replace({
            query: { ...router.query, page: value },
         });
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
                        sx={(theme) => ({
                            fontSize: "0.9rem",
                            color: theme.palette.textCustom.primary,
                            '&.Mui-focused': {
                                color: theme.palette.textCustom.focus,
                                borderColor: theme.palette.textCustom.focus,
                            },
                        })}
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
                        // inputProps={{
                        //     color: "red",
                        //     sx: {
                        //         bgcolor: filtersColors.backgoundInput,
                        //     }
                        // }}
                        sx={(theme) => ({
                            backgroundColor: theme.palette.backgroundCustom.dark,
                            mb: 3,
                            width: "180px",
                            fontSize: "0.9rem",
                            color: theme.palette.textCustom.primary,
                            'svg': {
                                color: theme.palette.primary.main,
                            },
                        })}
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
                sx={(theme) => ({
                    display: "flex",
                    justifyContent: "center",
                    mb: 1,
                    '&.MuiPagination-root': {
                        mb: 1,
                    },
                    '.MuiPaginationItem-root': {
                        color: theme.palette.textCustom.primary,

                        ':selected': {
                            backgroundColor: theme.palette.textCustom.primary,
                        } 
                    },
                })} 
            />
        </Page>
    )
}