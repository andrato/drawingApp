import { Box, CardMedia, Grid, Pagination, SelectChangeEvent, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { Page } from "@/components/utils/helpers/Page";
import { useRouter } from "next/router";
import { DrawingTypePartial, HOST_CATEGORY_DRAWINGS, getDrawingByCategory } from "@/services/Drawings";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { QueryFields } from "./QueryFields";
import { useDrawingsQuery } from "./useDrawingsQuery";

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
    const [itemsPage, setItemsPage] = useState<DrawingTypePartial[]>([]);
    const itemsPerPage = useItemsPerPage();
    const pageNumber = Number(router.query["page"] ?? 1);
    // partea in care cerem datele de la backend
    const {data, isLoading, isError, error} = useDrawingsQuery({category})
    const drawings: DrawingTypePartial[] = data?.data.drawings ?? []; 
    const pages = Math.max(Math.ceil(drawings.length / itemsPerPage), 1);
    const loadingOrError = isLoading || isError;

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
                <QueryFields />
                {loadingOrError && <LoadingsAndErrors isLoading={isLoading} isError={isError} /> }
                {!loadingOrError && (drawings.length 
                    ? (<Grid container spacing={1} sx={{
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
                       </Grid>) 
                    : (<Typography variant="body1" color="textCustom.primary">
                        {"There are no drawings at this moment in this category"}
                      </Typography>))}
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