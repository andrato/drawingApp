import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { ADMIN_USERS_API, getUser, getUsers } from "@/services/User";
import { DrawingDialog } from "../utils/helpers/DrawingDialog";

const DEFAULT_VALUES_DIALOG = {
    isOpen: false,
    handler: () => {},
    bodyText: '',
}

const Container = ({children}: {children: ReactNode}) => (
    <Box sx={{
        position: "relative",
        width: "calc(100% - 240px)",
        m: 2,
    }}>
        {children}
    </Box>
) 

export const AllUsers = ({userId}: {userId: string}) => {
    const [dialog, setDialog] = useState<{isOpen: boolean, handler: Function, bodyText: string}>(DEFAULT_VALUES_DIALOG);
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [ADMIN_USERS_API, userId],
        queryFn: () => getUsers(), 
        refetchOnMount: false,
        enabled: Boolean(userId) && userId !== null,
    });
    const users = data?.data?.users ?? [];

    if (isLoading || isError) {
        return <Container><LoadingsAndErrors isLoading={isLoading} isError={isError} /></Container>
    }

    if (!data) {
        return <Container><LoadingsAndErrors isLoading={false} isError={true} /></Container>
    }

    const handleEdit = () => {



        // reset the modal
        setDialog(DEFAULT_VALUES_DIALOG);
    }

    const handleDelete = () => {
        // reset the modal
        setDialog(DEFAULT_VALUES_DIALOG);
    }


    return <Container>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead sx={(theme) => ({bgcolor: theme.palette.backgroundCustom.dark, 'th': {
                    color: theme.palette.textCustom.primary}
                })}>
                    <TableRow sx={(theme) => ({color: theme.palette.textCustom.primary})}>
                        <TableCell align="center">Id</TableCell>
                        <TableCell align="center">Name</TableCell>
                        <TableCell align="center">Created</TableCell>
                        <TableCell align="center">Last updated</TableCell>
                        <TableCell align="center">Admin</TableCell>
                        <TableCell align="center">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {users.map((user, index) => (
                    <TableRow key={user.email} sx={(theme) => ({
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
                        <TableCell align="center">{user.created}</TableCell>
                        <TableCell align="center">{user.lastUpdated}</TableCell>
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
                                handler: handleEdit,
                                bodyText: "Are you sure do you want to change this user's rights?",
                            })}
                            >
                                Edit admin
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
                ))}
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