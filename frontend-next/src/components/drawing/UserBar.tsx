import { Avatar, Box, Card, CardContent, CardHeader, Chip, IconButton, Theme, Typography } from "@mui/material"
import { getNameInitials, isSameUser, isUserLoggedIn } from "../common/helpers";
import { FileDownloadOutlined } from "@mui/icons-material";

const getColor = ({palette}: Theme, index: number) => {
    const colors = [
        "#075282",
        "#8e3fb29c", //violet
        "#212121",
    ];
    const lenght = colors.length;

    const computeIndex = index % lenght;

    return colors[computeIndex];
}

export const UserBar = ({
    userId,
    userName,
    imgPath,
    date,
    drawingVideoPath,
    drawingImagePath,
    contentCateg,
    contentText,
}: {
    userId: string,
    userName: string,
    imgPath: string,
    date: number,
    drawingVideoPath?: string,
    drawingImagePath?: string,
    contentCateg?: string[],
    contentText?: string,
}) => {
    const {firstNameInitial, lastNameInitial} = getNameInitials({userName: userName});
    const formatDate = (new Date(date)).toDateString();
    const sameUser = isSameUser(userId) && isUserLoggedIn();

    return (
        <Card elevation={2} sx={(theme) => ({
            mt: 1,
            bgcolor: theme.palette.backgroundCustom.light,
            color: theme.palette.textCustom.primary,
            '.MuiCardHeader-subheader': {
                color: theme.palette.textCustom.subHeader,
            }
        })}>
            <CardHeader
                avatar={
                    <Avatar alt="userName" src={imgPath} sx={(theme) => ({bgcolor: theme.palette.textCustom.secondary, color: theme.palette.backgroundCustom.main})}>
                        {firstNameInitial}{lastNameInitial}
                    </Avatar>
                }
                action={
                    <>
                        {sameUser && <IconButton component="a" href={drawingVideoPath}>
                            <FileDownloadOutlined 
                            sx={(theme) => ({
                                color: theme.palette.textCustom.primary,
                            })}/>
                        </IconButton>}
                    </>
                    
                }
                title={userName}
                subheader={formatDate}
            />
            <CardContent>
                <Box>
                    <Typography variant="subtitle2" color={"textCustom.primary"}>
                        Labels
                    </Typography>
                    {contentCateg?.map((label, index) => {
                        return <Chip key={label} variant="outlined" label={label} 
                            color="primary"
                            sx={(theme) => ({
                                // color: theme.palette.textCustom.secondary,
                                // bgcolor: getColor(theme, index),
                                mr: 1,
                                mt: 1,
                            })}
                        />
                    })}
                </Box>
                {contentText && <Box sx={{mt: 3,}}>
                    <Typography variant="subtitle2" color={"textCustom.primary"}>
                        Description
                    </Typography>
                    <Typography variant="body2" color={"textCustom.primary"} sx={{mt: 1}}>
                        {contentText}
                    </Typography>
                </Box>}
            </CardContent>
        </Card>
    )
}