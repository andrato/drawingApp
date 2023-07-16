import { CommentType } from "@/services/CommentsAndRatings";
import { HOST_USER, getUser } from "@/services/User";
import { Avatar, Box, Card, CardContent, CardHeader, Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { LoadingsAndErrors } from "../utils/helpers/LoadingsAndErrors";

export const Comment = ({comment}: {comment: CommentType}) => {
    const paragraphs = comment.comment.split('<br>');
    const formatDate = (new Date(comment.created)).toDateString();
    const {data, isLoading, isError, error} = useQuery({
        queryKey: [HOST_USER, comment.userId],
        queryFn: () => getUser(comment.userId), 
        refetchOnMount: false,
        enabled: Boolean(comment.userId),
    });

    if (isLoading || isError) {
        return <Box sx={{mt: 1}}>
            <LoadingsAndErrors isLoading={isLoading} isError={isError} />
        </Box>
    }

    if (!data?.data?.user) {
        return null;
    }

    const user = data.data.user;
    const firstName = user?.firstName ?? '';
    const lastName = user?.lastName ?? '';
    const fullName = firstName.length ? (firstName + ' ' + lastName) : lastName;
    const isUnknown = !Boolean(firstName.length || lastName.length);

    return <Card elevation={2} sx={(theme) => ({
        mt: 1,
        bgcolor: theme.palette.backgroundCustom.light,
        color: theme.palette.textCustom.primary,
        '.MuiCardHeader-subheader': {
            color: theme.palette.textCustom.subHeader,
        }
    })}>
        <CardHeader
            avatar={
                <Avatar alt="userName" src={user?.imgLocation} sx={(theme) => ({bgcolor: theme.palette.textCustom.secondary, color: theme.palette.backgroundCustom.main})}>
                    {isUnknown ? 'U' : `${firstName[0]}${lastName[0]}`}
                </Avatar>
            }
            title={isUnknown ? 'Unknown' : fullName}
            subheader={formatDate}
        />
        <CardContent sx={{pt: 0}}>
            {paragraphs.map((text) => <p>{text}</p> )}        
        </CardContent>
    </Card>
}