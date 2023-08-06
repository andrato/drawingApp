import React, { useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogContentText, Button, DialogActions } from "@mui/material"

export type DrawingDialogProps = {
    open: boolean,
    showCloseButton?: boolean
    title: string,
    onClose: Function,
    description?: string,
    actionHandler?: Function, 
    buttonName1?: string,
    buttonName2?: string
}

export function DrawingDialog ({
    open = false,
    showCloseButton = false, // ToDo: show 'X' for the modal
    onClose,
    title,
    description,
    actionHandler,
    buttonName1 ='AGREE',
    buttonName2 = 'DISAGREE',
}: DrawingDialogProps) {
    return (
        <div>
            <Dialog 
                open={open}
            >
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {description && <DialogContentText> {description} </DialogContentText>}
                </DialogContent>
                <DialogActions>
                    {actionHandler && buttonName1 && <Button onClick={() => actionHandler()}>{buttonName1}</Button>}
                    <Button onClick={() => onClose()}>{buttonName2}</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

}