import { Box, FormControl, InputLabel, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, SxProps, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Theme, Typography } from "@mui/material";
import { ReactNode, useMemo, useState } from "react";
import { DataDrawings, HeadCellDrawing, Order, SortDataDrawings, getComparator, mapDrawingsToTableData, stableSort } from "./helpers";
import { QueryFields } from "../category/QueryFields";
import { useAdminDrawingsQuery } from "./useAdminDrawingsQuery";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { useRouter } from "next/router";

const headCellsSort: HeadCellDrawing[] = [
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
        id: 'userId',
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
];

const headCells: readonly HeadCellDrawing[] = [
    {
        id: 'labels',
        numeric: false,
        label: 'Labels',
    },
]
const Container = ({children}: {children: ReactNode}) => (
    <Box sx={{
        position: "relative",
        width: "calc(100% - 240px)",
        m: 2,
    }}>
        {children}
    </Box>
) ;

const EnhancedTableHead = (props: {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof SortDataDrawings) => void;
    order: Order;
    orderBy: string;
    columnsDisplay: {[key in keyof DataDrawings]: boolean}
}) => {
    const { order, orderBy, onRequestSort, columnsDisplay} = props;

    const createSortHandler =
        (property: keyof SortDataDrawings) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };
  
    return (
    <TableHead sx={(theme) => ({bgcolor: theme.palette.backgroundCustom.dark, 'th': {
        color: theme.palette.textCustom.primary}
    })}>
        <TableRow>
          {headCellsSort.map((headCell) => (
            columnsDisplay[headCell.id] && <TableCell
              key={headCell.id}
              align='center'
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id as keyof SortDataDrawings)}
                color="success"
                sx={(theme) => ({
                    color: `${theme.palette.textCustom.primary} !important`,
                    "svg:active, :hover, svg:hover": {
                        color: theme.palette.textCustom.primary,
                    },
                    ".MuiSvgIcon-root": {
                        color: theme.palette.textCustom.primary,
                    },
                    "> span > svg": {
                        color: theme.palette.textCustom.primary,
                        display: "block",
                    },
                    '.MuiTableSortLabel-root.MuiTableSortLabel-active, \
                    .MuiTableSortLabel-root:active, \
                    .MuiTableSortLabel-root:hover, \
                    .MuiTableSortLabel-icon': {
                        color: `${theme.palette.textCustom.primary} !important`,
                    }
                })}
              >
                {headCell.label}
                {/* {orderBy === headCell.id 
                    ? (<> {order === 'desc' ? <KeyboardArrowUp/> : <KeyboardArrowDown />} </>) 
                    : null
                } */}
              </TableSortLabel>
            </TableCell>
          ))}
          {headCells.map((headCell) => (
            columnsDisplay[headCell.id] && <TableCell
              align='center'
            >
                {headCell.label}
            </TableCell>
          ))}
          {columnsDisplay.category && <TableCell
              align='center'
            >
                Category
            </TableCell>}
        </TableRow>
    </TableHead>);
}  

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const HeadCells: {id: keyof DataDrawings, label: string}[] = [
    {id: "_id", label: "Id"},
    {id: "name", label: 'Name'},
    {id: "userId", label: 'User Id'},
    {id: "reviews", label: 'Reviews'},
    {id: "rating", label: 'Rating'},
    {id: "created", label: 'Created'},
    {id: "lastUpdated", label: 'Last Updated'},
    {id: "labels", label: 'Labels'},
    {id: "category", label: 'Category'},
];

export const AllDrawings = ({userId}: {userId: string}) => {
    const {data, isLoading, isError, error} = useAdminDrawingsQuery({userId})
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof SortDataDrawings>('created');
    const loadingOrError = isLoading || isError;
    const router = useRouter();
    const [columns, setColumns] = useState<string[]>([
        "Id",
        "Name",
        "Created",
        "Reviews",
        "Rating",
        "Labels",
        "Category",
    ]);
    const [columnsDisplay, setColumnsDisplay] = useState<{[key in keyof DataDrawings]: boolean}>({
        _id: true,
        userId: false,
        name: true,
        created: true, 
        lastUpdated: false,
        reviews: true,
        rating: true,
        labels: true,
        category: true,
    });

    const drawingSortTable = useMemo(
        () => stableSort(mapDrawingsToTableData(data?.data?.drawings ?? []), getComparator(order, orderBy))
        , [order, orderBy, data]
    );

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof SortDataDrawings,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleDisplayColumns = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;

        const columnsVisible = typeof value === 'string' ? value.split(',') : value;

        setColumns(columnsVisible);
    } 

    const handleChangeColumns = (columnId: string) => {
        const checkState = columnsDisplay[columnId as keyof DataDrawings];
        setColumnsDisplay({...columnsDisplay, [columnId]: !checkState});
    }

    return  <Container>
        <QueryFields 
            showSortBy={false} 
            showCategory={true}
            onResetFilters={() => {
                router.replace({
                    query: {category: router.query.category},
                });
            }}
        >
            <FormControl sx={{ width: 150 }}>
                <InputLabel 
                    size="small"
                    id="demo-multiple-name-label"
                >Display columns</InputLabel>
                <Select
                    size="small"
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={columns}
                    onChange={handleDisplayColumns}
                    input={<OutlinedInput label="Display columns" />}
                >
                    {HeadCells.map((column) => (
                        <MenuItem
                            key={column.label}
                            value={column.label}
                            sx={(theme) => ({
                                ':hover': {
                                    bgcolor: "#bcbcbc",
                                },
                                '&.Mui-selected, &.Mui-selected:hover': {
                                    bgcolor: theme.palette.textCustom.disabled,
                                }
                            })}
                            onClick={() => handleChangeColumns(column.id)}
                        >
                            {column.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </QueryFields>
        {loadingOrError && <LoadingsAndErrors isLoading={isLoading} isError={isError} /> }

        {!loadingOrError && (drawingSortTable.length 
            ? <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <EnhancedTableHead
                        order={order}
                        orderBy={orderBy}
                        onRequestSort={handleRequestSort}
                        columnsDisplay={columnsDisplay}
                    />
                    <TableBody>
                        {drawingSortTable.map((drawing, index) => {
                            const dateCreated = new Date(drawing.created).toLocaleDateString();
                            const dateUpdated = new Date(drawing.lastUpdated).toLocaleDateString();

                            return <TableRow key={drawing._id} sx={(theme) => ({
                                bgcolor: (index % 2 === 1) ? '#bababa' : '#e0dfdf',
                                ...((drawing._id === userId) 
                                    ? {
                                        boxShadow: `inset 0px 0px 0px 4px ${theme.palette.error.main}`
                                    } 
                                    : {}),
                                ':hover': {
                                    bgcolor: '#939393',
                                }
                            })}>
                                {columnsDisplay._id && <TableCell align="center" component="th" scope="row">
                                    {drawing._id}
                                </TableCell>}
                                {columnsDisplay.name && <TableCell align="center">{drawing.name}</TableCell>}
                                {columnsDisplay.userId && <TableCell align="center">{drawing.userId}</TableCell>}
                                {columnsDisplay.reviews && <TableCell align="center">{drawing.reviews}</TableCell>}
                                {columnsDisplay.rating && <TableCell align="center">{drawing.rating}</TableCell>}
                                {columnsDisplay.created &&<TableCell align="center">{dateCreated}</TableCell>}
                                {columnsDisplay.lastUpdated && <TableCell align="center">{dateUpdated}</TableCell>}
                                {columnsDisplay.labels &&<TableCell align="center">{drawing.labels}</TableCell>}
                                {columnsDisplay.category && <TableCell align="center">{drawing.category}</TableCell>}
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
              </TableContainer> 
            : <Typography variant="body1" color="textCustom.primary">
                {"No drawings found for the current filters"}
              </Typography>
            )
        }
    </Container>;
}