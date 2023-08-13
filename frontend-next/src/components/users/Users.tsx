import { BodyContainer } from "@/components/utils/helpers/BodyContainer";
import { useUsersQuery } from "./useUsersQuery";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";
import { Grid, Typography } from "@mui/material";
import { User } from "./User";
import { UserQueryFields } from "./UserQueryFields";

export function Users() {
    const {data, isLoading, isError} = useUsersQuery();
    const errorOrLoading = isError || isLoading;
    const users = data?.data.users ?? [];

    return (<BodyContainer>
        <UserQueryFields />
        {errorOrLoading && <LoadingsAndErrors isLoading={isLoading} isError={isError} />}
        {!errorOrLoading && (users.length 
            ? (<Grid container spacing={1} sx={{
                    mb: 2,
                }}>
                    {users.map((user) => (
                        <Grid item lg={4}  md={6} xs={12} key={user.email}>
                            <User {...user}/> 
                        </Grid>
                    ))}
                </Grid>)
            : <Typography variant="body1" color="textCustom.primary">
                {"No users found!"}
            </Typography>
        )}

    </BodyContainer>)
}