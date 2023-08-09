import { Box, Button, FormControlLabel, FormGroup, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useMemo, useState } from "react";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { ADMIN_USERS_API, deleteUser, getUsers, modifyUser } from "@/services/User";
import { DrawingDialog } from "../utils/helpers/DrawingDialog";
import { HeadCell, Order, SortData, getComparator, mapUsersToTableData, stableSort } from "./helpers";

const DEFAULT_VALUES_DIALOG = {
    isOpen: false,
    handler: () => {},
    bodyText: '',
}

const headCellsSort: readonly HeadCell[] = [
    {
      id: '_id',
      numeric: false,
      label: 'Id',
    },
    {
      id: 'name',
      numeric: false,
      label: 'Name',
    },
    {
      id: 'created',
      numeric: true,
      label: 'Created',
    },
    {
      id: 'lastUpdated',
      numeric: true,
      label: 'Last updated',
    },
    {
        id: 'drawings',
        numeric: true,
        label: 'Drawings',
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

const EnhancedTableHead = (props: {
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof SortData) => void;
    order: Order;
    orderBy: string;
}) => {
    const { order, orderBy, onRequestSort } = props;

    const createSortHandler =
        (property: keyof SortData) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };
  
    return (
    <TableHead sx={(theme) => ({bgcolor: theme.palette.backgroundCustom.dark, 'th': {
        color: theme.palette.textCustom.primary}
    })}>
        <TableRow>
          {headCellsSort.map((headCell) => (
            <TableCell
              key={headCell.id}
              align='center'
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id as keyof SortData)}
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
            <TableCell
              align='center'
            >
                {headCell.label}
            </TableCell>
          ))}
          <TableCell
              align='center'
            >
                Actions
            </TableCell>
        </TableRow>
    </TableHead>);
}  

export const AllUsers = ({userId}: {userId: string}) => {
    const [dialog, setDialog] = useState<{isOpen: boolean, handler: Function, bodyText: string}>(DEFAULT_VALUES_DIALOG);
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [ADMIN_USERS_API, userId],
        queryFn: () => getUsers(), 
        refetchOnMount: false,
        enabled: Boolean(userId) && userId !== null,
    });
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof SortData>('created');
    const [showUserType, setShowUserType] = useState<{onlyAdmins: boolean; onlyNormal: boolean}>({onlyAdmins: false, onlyNormal: false});

    const users = data?.data?.users ?? [];

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof SortData,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const usersSortTable = useMemo(
        () => stableSort(mapUsersToTableData(data?.data?.users ?? []), getComparator(order, orderBy))
        , [order, orderBy, data]
    );

    const usersSort= useMemo(
        () => {
            if (showUserType.onlyAdmins) {
                return usersSortTable.filter((user) => user.admin)
            } else if (showUserType.onlyNormal) {
                return usersSortTable.filter((user) => !user.admin)
            } else {
                return usersSortTable;
            }
        }
        , [usersSortTable, showUserType]
    );

    const queryClient = useQueryClient();

    if (isLoading || isError) {
        return <Container><LoadingsAndErrors isLoading={isLoading} isError={isError} /></Container>
    }

    if (!data) {
        return <Container><LoadingsAndErrors isLoading={false} isError={true} /></Container>
    }

    const handleEdit = async (userIdChanges: string) => {
        // send data to backend
        try {
            await modifyUser(userIdChanges);

            const index = users.findIndex(obj => {
                return obj._id === userIdChanges;
            });

            users[index].isAdmin = !users[index].isAdmin;

            queryClient.setQueryData([ADMIN_USERS_API, userId], {data: {users: users}});
        } catch (err) {
            alert("An error occured!");
        }

        // reset the modal
        setDialog(DEFAULT_VALUES_DIALOG);
    }

    const handleDelete = async (userIdChanges: string) => {
        // send data to backend
        try {
            await deleteUser(userIdChanges);

            const usersUpdated = users.filter((obj) => {
                if (obj._id !== userIdChanges) {
                    return true;
                }

                return false;
            }); 

            queryClient.setQueryData([ADMIN_USERS_API, userId], {data: {users: usersUpdated}});
        } catch (err) {
            alert("An error occured!");
        }

        // reset the modal
        setDialog(DEFAULT_VALUES_DIALOG);
    }

    return <Container>
        <FormGroup aria-label="position" row sx={(theme) => ({
            color: theme.palette.textCustom.primary, 
            'span': {
                color: theme.palette.textCustom.primary, 
                fontSize: theme.typography.body2,
            },
            '.MuiFormControlLabel-label.Mui-disabled': {
                color: `${theme.palette.textCustom.disabled} !important`,
            },
            mb: 1,
        })}>
            <FormControlLabel
                value="admin"
                control={<Switch color="primary" disabled={showUserType.onlyNormal} onChange={() => setShowUserType({...showUserType, onlyAdmins: !showUserType.onlyAdmins})}/>}
                label="Only admin"
                labelPlacement="start"
            />
            <FormControlLabel
                value="normal"
                control={<Switch color="primary" disabled={showUserType.onlyAdmins} onChange={() => setShowUserType({...showUserType, onlyNormal: !showUserType.onlyNormal})}/>}
                label="Only normal"
                labelPlacement="start"
            />
        </FormGroup>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                />
                <TableBody>
                {usersSort.map((user, index) => {
                    const dateCreated = new Date(user.created).toLocaleDateString();
                    const dateUpdated = new Date(user.lastUpdated).toLocaleDateString();

                    return <TableRow key={user._id} sx={(theme) => ({
                        bgcolor: (index % 2 === 1) ? '#bababa' : '#e0dfdf',
                        ...((user._id === userId) 
                            ? {
                                boxShadow: `inset 0px 0px 0px 4px ${theme.palette.error.main}`
                              } 
                            : {}),
                        ':hover': {
                            bgcolor: '#939393',
                        }
                    })}>
                        <TableCell align="center" component="th" scope="row">
                            {user._id}
                        </TableCell>
                        <TableCell align="center">{user.name}</TableCell>
                        <TableCell align="center">{dateCreated}</TableCell>
                        <TableCell align="center">{dateUpdated}</TableCell>
                        <TableCell align="center">{user.drawings}</TableCell>
                        <TableCell align="center">{JSON.stringify(user.admin)}</TableCell>
                        <TableCell align="center">
                            <Button size="small" color="success" variant="contained" sx={(theme) => ({
                                fontWeight: "bold",
                                fontSize: theme.customSizes.fontSizeButtonsText,
                                borderRadius: "18px",
                                textTransform: 'none',
                                p: "3px 12px",
                                mr: 1,
                                [theme.breakpoints.down(1263)]: {
                                    mt: 0, mb: 1,
                                }
                            })}
                            onClick={() => setDialog({
                                isOpen: true,
                                handler: () => {handleEdit(user._id)},
                                bodyText: "Are you sure do you want to change this user's rights?",
                            })}
                            >
                                Change admin
                            </Button>
                            <Button size="small" color="error" variant="contained" sx={(theme) => ({
                                fontWeight: "bold",
                                fontSize: theme.customSizes.fontSizeButtonsText,
                                borderRadius: "18px",
                                textTransform: 'none',
                                p: "3px 12px",
                            })}
                            onClick={() => setDialog({
                                isOpen: true,
                                handler: () => {handleDelete(user._id)},
                                bodyText: `Are you sure do you want to delete the user ${user.name}?`,
                            })}
                            >
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                })}
                </TableBody>
            </Table>
        </TableContainer>
        <DrawingDialog 
            title="Verify action"
            open={dialog.isOpen}
            description={dialog.bodyText}
            onClose={() => {
                setDialog(DEFAULT_VALUES_DIALOG);
            }}
            actionHandler={dialog.handler}
        />
    </Container>;
}