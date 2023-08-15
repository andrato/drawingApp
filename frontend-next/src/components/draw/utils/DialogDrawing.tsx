import { Close } from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, DialogTitleProps, IconButton, Typography } from "@mui/material";
import { ReactNode } from "react";

const DialogTitleComponent = (props: DialogTitleProps & {onClose: () => void}) => {
    const { children, onClose, ...other } = props;
  
    return (
		<DialogTitle sx={{ m: 0, p: 2 }} {...other}>
			{children}
			{onClose ? (
				<IconButton
					aria-label="close"
					onClick={() => onClose()}
					sx={{
					position: 'absolute',
					right: 8,
					top: 8,
					color: (theme) => theme.palette.grey[500],
					p: 0
					}}
				>
				<Close />
			</IconButton>
			) : null}
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
            // onClose={() => onHandleClose && onHandleClose()}
        >
            {title && <DialogTitleComponent onClose={() => onHandleClose && onHandleClose()}>
                <Typography variant="body1" sx={{mr: 3}}>{title}</Typography>
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