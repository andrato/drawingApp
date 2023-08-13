import { useUsersQuery } from "./useUsersQuery";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { Grid, Pagination, Typography, useMediaQuery, useTheme } from "@mui/material";
import { User } from "./User";
import { UserQueryFields } from "./UserQueryFields";
import { Page } from "../utils/helpers/Page";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { UserType } from "@/services/User";
import { useQueryParams } from "../category/useQueryParams";
import { SortBy } from "../common/constants";

export const Container = ({children}: {children: ReactNode}) => (
    <Page hasMarginX={true} sx={{
        display: "flex",
        flexDirection: "column", 
        justifyContent: "space-between",
        overflow: "auto",
    }}>
        {children}
    </Page>
)

export const useItemsPerPage = () => {
    const theme = useTheme();
    const isMediumScreenUp = useMediaQuery(theme.breakpoints.up('md'));
    const isLargeScreenUp = useMediaQuery(theme.breakpoints.up('lg'));
    // const isXsDown = useMediaQuery(theme.breakpoints.down('lg'));

    if (isLargeScreenUp) {
        return 9;
    } else if (isMediumScreenUp) {
        return 8;
    }

    return 5;
}

export function Users() {
    const router = useRouter();
    const [itemsPage, setItemsPage] = useState<UserType[]>([]);
    const itemsPerPage = useItemsPerPage();
    const pageNumber = Number(router.query["page"] ?? 1);
    const {sortBy, startDate, endDate, searchUser} = useQueryParams();

    const {data, isLoading, isError} = useUsersQuery();
    const errorOrLoading = isError || isLoading;
    const users = useMemo(() => {
        const initialUsers = data?.data.users ?? [];

        if (initialUsers.length === 0) {
            return initialUsers;
        }

        const startDateMs = startDate ? (new Date(startDate)).getTime() : undefined;
        const endDateMs = endDate ? (new Date(endDate)).getTime() : undefined;

        let filteredArray = initialUsers
            .filter((user) => {
                if (startDateMs && endDateMs) {
                    return (user.created >= startDateMs && user.created <= endDateMs);
                } else if (startDateMs) {
                    return user.created >= startDateMs;
                } else if (endDateMs) {
                    return user.created <= endDateMs;
                }

                return true;
            })
            .filter((user) => {
                if (!searchUser) {
                    return true;
                }

                const name = user.firstName.toLowerCase() + " " + user.lastName.toLocaleLowerCase();

                return name.includes(searchUser.toLowerCase());
            })
        
        switch(sortBy) {
            case "newest": {
                filteredArray = filteredArray.sort((a,b) => b.created - a.created);
                break;
            };
            case "oldest": {
                filteredArray = filteredArray.sort((a,b) => a.created - b.created);
                break;
            };
            case "reviewsUp": {
                filteredArray = filteredArray.sort((a,b) => b.reviews - a.reviews);
                break;
            };
            case "reviewsDown": { 
                filteredArray = filteredArray.sort((a,b) => a.reviews - b.reviews);
                break;
            };
            case "highRatings": {
                filteredArray = filteredArray.sort((a,b) => (b.rating ?? 0) - (a.rating ?? 0));
                break;
            };
            case "lowRatings": {
                filteredArray = filteredArray.sort((a,b) => (a.rating ?? 0) - (b.rating ?? 0));
                break;
            };
        }

        return filteredArray;
    }, [sortBy, startDate, endDate, searchUser, data])
    

    const pages = Math.max(Math.ceil(users.length / itemsPerPage), 1);


    useEffect(() => {
        const computeItems = (pageNumber: number) => {
            pageNumber--;
    
            let indexStart = (itemsPerPage * pageNumber);
    
            if (indexStart) {
                indexStart--;
            }
    
            const indexEnd = indexStart + itemsPerPage;
            const draw = users.slice(indexStart, indexEnd);
            return draw;
        }

        if (pageNumber > pages) {
            router.replace({
                query: { ...router.query, page: pages },
            });
        }

        const itemsAux = computeItems(pageNumber);
        setItemsPage(itemsAux);
    }, [itemsPerPage, pageNumber, users])

    const handlePageChange = (event: any, value: number) => {
        router.replace({
            query: { ...router.query, page: value },
        });
    }

    const handleClick = (id: string) => {
        id && router.push(`/users/${id}`);
    }

    return (<Container>
        <div>
            <UserQueryFields />
            {errorOrLoading && <LoadingsAndErrors isLoading={isLoading} isError={isError} />}
            {!errorOrLoading && (users.length 
                ? (<Grid container spacing={2} sx={{
                        mb: 2,
                    }}>
                        {itemsPage.map((user) => (
                            <Grid item lg={4} md={6} xs={12} key={user.email} >
                                <User {...user} onClick={handleClick}/> 
                            </Grid>
                        ))}
                    </Grid>)
                : <Typography variant="body1" color="textCustom.primary">
                    {"No users found!"}
                </Typography>
            )}
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
    </Container>)
}