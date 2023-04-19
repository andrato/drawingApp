import { Dialog, DialogContent, DialogTitle, DialogTitleProps, IconButton, Typography } from "@mui/material"
import {Close} from '@mui/icons-material';
import { ReactNode } from "react"
import { Step } from "./utils";

const DialogTitleComponent = (props: DialogTitleProps & {onClose: (step?: Step) => void}) => {
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

export const DialogUser = ({
    open,
    onHandleClose,
    children,
    title,
}: {
    open: boolean;
    onHandleClose: (step?: Step) => void;
    children: ReactNode,
    title: string
}) => {

    return (
        <Dialog 
            open={open}
            onClose={() => onHandleClose()}
        >
            <DialogTitleComponent onClose={onHandleClose}>
                <Typography variant="h6" sx={{mr: 3}}>{title}</Typography>
            </DialogTitleComponent>
            <DialogContent sx={{
                width: "300px",
                p: 2
            }}>
                {children}
            </DialogContent>
        </Dialog>
    )
}