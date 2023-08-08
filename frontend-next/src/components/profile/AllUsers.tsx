import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactNode, useMemo, useState } from "react";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { ADMIN_USERS_API, UserType, deleteUser, getUser, getUsers, modifyUser } from "@/services/User";
import { DrawingDialog } from "../utils/helpers/DrawingDialog";
import { Order, getComparator, stableSort } from "./helpers";
import { visuallyHidden } from "@mui/utils";

const DEFAULT_VALUES_DIALOG = {
    isOpen: false,
    handler: () => {},
    bodyText: '',
}
interface Data {
    _id: string;
    name: string;
    created: number;
    updated: number;
    admin: boolean;
    actions: ReactNode;
}

interface SortData {
    _id: string;
    name: string;
    created: number;
    updated: number;
}

interface HeadCell {
    id: keyof Data;
    label: string;
    numeric: boolean;
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
      id: 'updated',
      numeric: true,
      label: 'Last updated',
    },
];

const headCells: readonly HeadCell[] = [
    {
        id: 'admin',
        numeric: false,
        label: 'Admin',
    },
    {
        id: 'actions',
        numeric: false,
        label: 'Actions',
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
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
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

    const users = data?.data?.users ?? [];

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof SortData,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const usersSort = useMemo(
        () => stableSort(data?.data?.users ?? [], getComparator(order, orderBy))
        , [order, orderBy]
    );

    const queryClient = useQueryClient();

    if (isLoading || isError) {
        return <Container><LoadingsAndErrors isLoading={isLoading} isError={isError} /></Container>
    }

    if (!data) {
        return <Container><LoadingsAndErrors isLoading={false} isError={true} /></Container>
    }

    const handleEdit = async (userId: string) => {
        // send data to backend
        try {
            await modifyUser(userId);

            const index = users.findIndex(obj => {
                return obj._id === userId;
            });
            users[index].isAdmin = !users[index].isAdmin;

            queryClient.setQueryData([ADMIN_USERS_API], users);
        } catch (err) {
            alert("An error occured!");
        }

        // reset the modal
        setDialog(DEFAULT_VALUES_DIALOG);
    }

    const handleDelete = async (userId: string) => {
        // send data to backend
        try {
            await deleteUser(userId);

            const usersUpdated = users.filter((obj) => {
                if (obj._id !== userId) {
                    return true;
                }

                return false;
            }); 

            queryClient.setQueryData([ADMIN_USERS_API], usersUpdated);
        } catch (err) {
            alert("An error occured!");
        }

        // reset the modal
        setDialog(DEFAULT_VALUES_DIALOG);
    }


    return <Container>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                />
                <TableBody>
                {users.map((user, index) => {
                    const dateCreated = new Date(user.created).toLocaleDateString();
                    const dateUpdated = new Date(user.created).toLocaleDateString();

                    return <TableRow key={user.email} sx={(theme) => ({
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
                        <TableCell align="center">{user.lastName + ", " + user.firstName}</TableCell>
                        <TableCell align="center">{dateCreated}</TableCell>
                        <TableCell align="center">{dateUpdated}</TableCell>
                        <TableCell align="center">{JSON.stringify(user.isAdmin)}</TableCell>
                        <TableCell align="center">
                            <Button size="small" color="success" variant="contained" sx={(theme) => ({
                                fontWeight: "bold",
                                fontSize: theme.customSizes.fontSizeButtonsText,
                                borderRadius: "18px",
                                textTransform: 'none',
                                p: "3px 12px",
                                mr: 1,
                                [theme.breakpoints.down(1160)]: {
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
                                handler: handleDelete,
                                bodyText: `Are you sure do you want to delete the user ${user.lastName + " " + user.firstName}?`,
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