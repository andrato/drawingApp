import React, { ReactNode } from "react";
import { Box, Button, ButtonProps, Divider, Typography } from "@mui/material";
import { isSameUser } from "../common/helpers"
import { DeleteOutline, EditOutlined, ThumbUpOutlined, ThumbUpSharp } from "@mui/icons-material";

const ActionButton = ({children, ...props}: {children: ReactNode} & ButtonProps) => (
    <Button 
        size="medium"
        sx={(theme) => ({
            textTransform: "inherit",
            color: theme.palette.textCustom.primary,
            mr: 2,
        })}
        {...props}
    >
        <Typography variant="body2" >
            {children}
        </Typography>
    </Button>
)

export const ActionBar = ({
    userId,
    onClickEdit,
}: {
    userId: string,
    onClickEdit?: () => void,
}) => {
    const sameUser = isSameUser(userId);

    // TODO:  when and if I will have more buttons => remove this
    if(!sameUser) {
        return null;
    }
 
    return <Box sx={{mb: "-16px"}}>
        <Divider sx={(theme) => ({borderBottomColor: theme.palette.textCustom.subHeader, mt: 1})} />
        <Box sx={{my: 1}}>
            {sameUser && <>
                <ActionButton 
                    startIcon={<EditOutlined fontSize="small"/>}
                    onClick={onClickEdit}
                >
                    Edit
                </ActionButton>
                {/* <ActionButton 
                    startIcon={<DeleteOutline fontSize="small"/>}
                    onClick={onClickEdit}
                >
                    Delete
                </ActionButton> */}
            </>}
            {/* <ActionButton startIcon={<ThumbUpOutlined fontSize="small"/>}>
                Like
            </ActionButton> */}
        </Box>
    </Box>;
}