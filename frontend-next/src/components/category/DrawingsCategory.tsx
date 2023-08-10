import { Box, CardMedia, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { Page } from "@/components/utils/helpers/Page";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { DrawingTypePartial, HOST_CATEGORY_DRAWINGS, getDrawingByCategory } from "@/services/Drawings";
import { SortBy, sortByOptions } from "@/components/common/constants";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";

export const useItemsPerPage = () => {
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

export const Container = ({children, width}: {children: ReactNode, width?: string}) => (
    <Page hasMarginX={true} sx={{
        display: "flex",
        flexDirection: "column", 
        justifyContent: "space-between",
        ...(width ? {width: "calc(100% - 240px)"} : {}),
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
    // partea in care cerem datele de la backend
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [HOST_CATEGORY_DRAWINGS, category],
        queryFn: () => getDrawingByCategory(category), 
        refetchOnMount: false,
    });
    const drawings: DrawingTypePartial[] = data?.data.drawings ?? []; 
    const pages = Math.max(Math.ceil(drawings.length / itemsPerPage), 1);

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

        if (pageNumber > pages) {
            router.replace({
                query: { ...router.query, page: pages },
            });
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
                <Box sx={(theme) => ({
                    '&.MuiPopover-paper': {
                        bgcolor: `${theme.palette.backgroundCustom.dark} !important`,
                    }
                })}>
                    <FormControl>
                    <InputLabel 
                        id="demo-simple-select-standard-label"
                        size="small"
                        sx={(theme) => ({
                            fontSize: "0.9rem",
                            color: `${theme.palette.textCustom.primary} !important`,
                            '&.Mui-focused': {
                                color: `${theme.palette.info.main} !important`,
                                borderColor: `${theme.palette.info.main} !important`,
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
                        color="info"
                        // inputProps={{
                        //     color: "red",
                        //     sx: {
                        //         bgcolor: filtersColors.backgoundInput,
                        //     }
                        // }}
                        sx={(theme) => ({
                            bgColor: theme.palette.backgroundCustom.dark,
                            mb: 3,
                            width: "180px",
                            fontSize: "0.9rem",
                            color: `${theme.palette.textCustom.primary} !important`,
                            'svg': {
                                color: theme.palette.primary.main,
                            },
                        })}
                    >
                        {sortByOptions.map((option) => {
                            return <MenuItem value={option} sx={(theme) => ({
                                bgcolor: theme.palette.backgroundCustom.dark,
                                fontSize: "0.9rem",
                                color: `${theme.palette.textCustom.primary} !important`,
                                ':hover': {
                                    bgcolor: theme.palette.backgroundCustom.light,
                                },
                                '&.Mui-selected': {
                                    bgcolor: theme.palette.backgroundCustom.light,
                                },
                            })}>{option}</MenuItem>
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