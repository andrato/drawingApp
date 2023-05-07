import { Box, CardMedia, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { Page } from "@/components/utils/helpers/Page";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { DrawingTypePartial, getDrawingByCategory } from "@/services/Drawings";
import { SortBy, sortByOptions } from "@/components/common/constants";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";


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

const Container = ({children}: {children: ReactNode}) => (
    <Page hasMarginX={true} sx={{
        display: "flex",
        flexDirection: "column", 
        justifyContent: "space-between",
    }}>
        {children}
    </Page>
)

export const DrawingsCategory = ({category}: {category: string}) => {
    const router = useRouter();
    const [sortBy, setSortBy] = useState<SortBy>(SortBy.RECENT);
    const [itemsPage, setItemsPage] = useState<DrawingTypePartial[]>([]);
    const itemsPerPage = useItemsPerPage();
    const pageNumber = Number(router.query["page"] ?? 1);
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [category],
        queryFn: () => getDrawingByCategory(category), 
        refetchOnMount: false,
    });
    const drawings: DrawingTypePartial[] = data?.data.drawings ?? []; 
    const pages = Math.ceil(drawings.length / itemsPerPage);

    useEffect(() => {
        const computeItems = (pageNumber: number) => {
            pageNumber--;
    
            let indexStart = (itemsPerPage * pageNumber);
    
            if (indexStart) {
                indexStart--;
            }
    
            const indexEnd = indexStart + itemsPerPage;
            const draw = drawings.slice(indexStart, indexEnd);
            return draw;
        }

        const itemsAux = computeItems(pageNumber);
        setItemsPage(itemsAux);
    }, [itemsPerPage, pageNumber, drawings])

    if (isLoading || isError) {
        return <Container><LoadingsAndErrors isLoading={isLoading} isError={isError} /></Container>
    }

    const handlePageChange = (event: any, value: number) => {
        router.replace({
            query: { ...router.query, page: value },
         });
    }

    const handleClick = (id: string) => {
        router.push(`/gallery/${id}`);
    }

    return (
        <Container>
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
                
                {drawings.length ? (<Grid container spacing={1} sx={{
                    mb: 2,
                }}>
                    {itemsPage?.length && itemsPage.map((item) => {
                        return (
                            <Grid item md={2} sm={3} xs={4} key={item.id}>
                                <Box sx={{position: "relative"}}>
                                    <CardMedia
                                        component="img"
                                        image={item.image.location}
                                        alt={item.displayTitle}
                                        sx={{
                                            mr: 1,
                                            position: "relative",
                                        }}
                                    />
                                    <Box 
                                        onClick={() => {
                                            handleClick(item.id);
                                        }}
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            background: "rgba(0, 0, 0, 0.7)",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            opacity: 0,

                                            ':hover': {
                                                opacity: 1,
                                            },
                                        }}
                                    >
                                        <Typography variant="body1" color="textCustom.primary">
                                            {item.displayTitle}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        )
                    })}
                </Grid>) : (<Typography variant="body1" color="textCustom.primary">
                    {"There are no drawings at this moment in this category"}
                </Typography>)}
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
        </Container>
    )
}