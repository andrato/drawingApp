import { Box, CardMedia, Grid, Pagination, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { DrawingTypePartial, HOST_USER_DRAWINGS, getDrawingByUser} from "@/services/Drawings";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { Page } from "../utils/helpers/Page";
import { QueryFields } from "../category/QueryFields";
import { useDrawingsQuery } from "../category/useDrawingsQuery";

const useItemsPerPage = () => {
    const theme = useTheme();
    const isMediumScreenUp = useMediaQuery(theme.breakpoints.up('md'));
    const isSmallScreenUp = useMediaQuery(theme.breakpoints.up('sm'));

    if (isMediumScreenUp) {
        return 4 * 3;
    } else if (isSmallScreenUp) {
        return 3 * 3;
    }

    return 3 * 5;
}

const Container = ({children}: {children: ReactNode}) => (
    <Page hasMarginX={true} sx={{
        display: "flex",
        flexDirection: "column", 
        justifyContent: "space-between",
        width: "calc(100% - 240px)",
        height: "calc(100% - 36px)",
    }}>
        {children}
    </Page>
)

export const ProfileDrawings = ({userId}: {userId: string}) => {
    const router = useRouter();
    const [itemsPage, setItemsPage] = useState<DrawingTypePartial[]>([]);
    const itemsPerPage = useItemsPerPage();
    const pageNumber = Number(router.query["page"] ?? 1);
    const {data, isLoading, isError} = useDrawingsQuery({
        refetchOnMount: false,
        enabled: Boolean(userId),
        userId,
    });
    const loadingOrError = isLoading || isError || !userId;
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
    }, [itemsPerPage, pageNumber, drawings.length])

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
            <QueryFields
                showSortBy={true} 
                showCategory={true}
                onResetFilters={() => {
                    router.replace({
                        query: {category: router.query.category},
                    });
                }}
            />
            {loadingOrError && <LoadingsAndErrors isLoading={isLoading} isError={isError} />}
            {!loadingOrError && <Box sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "space-between",
            }}>
                <div>
                    {drawings.length ? (<Grid container spacing={1} sx={{
                        mb: 2,
                    }}>
                        {itemsPage?.length && itemsPage.map((item) => {
                            return (
                                <Grid item md={2} sm={4} xs={4} key={item.id}>
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
            </Box>}
        </Container>
    )
}
