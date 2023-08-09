import { Box } from "@mui/material";
import { ReactNode } from "react";
import { HeadCell } from "./helpers";

const headCellsSort: readonly HeadCell[] = [
    {
        id: '_id',
        numeric: false,
        label: 'Id',
        displayed: true,
    },
    {
        id: 'name',
        numeric: false,
        label: 'Name',
        displayed: true,
    },
    {
        id: 'user_id',
        numeric: false,
        label: 'User Id',
        displayed: true,
    },
    {
        id: 'reviews',
        numeric: true,
        label: 'Reviews',
        displayed: true,
    },
    {
        id: 'rating',
        numeric: true,
        label: 'Rating',
        displayed: true,
    },
    {
        id: 'created',
        numeric: true,
        label: 'Created',
        displayed: true,
    },
    {
        id: 'lastUpdated',
        numeric: true,
        label: 'Last updated',
        displayed: false,
    },
    {
        id: 'drawings',
        numeric: true,
        label: 'Drawings',
        displayed: true,
    },
];

const headCells: readonly HeadCell[] = [
    {
        id: 'admin',
        numeric: false,
        label: 'Admin',
    },
]
const Container = ({children}: {children: ReactNode}) => (
    <Box sx={{
        position: "relative",
        width: "calc(100% - 240px)",
        m: 2,
        overflow: "scroll",
    }}>
        {children}
    </Box>
) 

export const AllDrawings = ({userId}: {userId: string}) => {

    return <Container>
    
    </Container>;
}