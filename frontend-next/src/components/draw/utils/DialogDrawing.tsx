import { Dialog, DialogContent, DialogTitle, DialogTitleProps, IconButton, Typography } from "@mui/material";
import { ReactNode } from "react";

const DialogTitleComponent = (props: DialogTitleProps) => {
    const { children, ...other } = props;
  
    return (
		<DialogTitle sx={{ m: 0, p: 2 }} {...other}>
			{children}
		</DialogTitle>
    );
}

export const DialogDrawing = ({
    open,
    onHandleClose,
    children,
    title,
    width = 400,
}: {
    open: boolean;
    onHandleClose?: () => void;
    children: ReactNode,
    title?: string,
    width?: number,
}) => {

    return (
        <Dialog 
            open={open}
            onClose={() => onHandleClose && onHandleClose()}
        >
            {title && <DialogTitleComponent>
                <Typography variant="h6" sx={{mr: 3}}>{title}</Typography>
            </DialogTitleComponent>}
            <DialogContent sx={{
                width: `${width}px`,
                p: 2
            }}>
                {children}
            </DialogContent>
        </Dialog>
    )
}