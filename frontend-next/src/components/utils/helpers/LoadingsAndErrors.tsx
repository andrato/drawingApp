import { Alert, CircularProgress } from "@mui/material";

export const LoadingsAndErrors = ({
    isLoading,
    isError,
}: {
    isLoading: boolean;
    isError: boolean;
}) => {
    if (isLoading) {
        return <CircularProgress />
    }

    if (isError) {
        return <Alert severity="error">Error occured when loading data</Alert>
    }

    return null;
}