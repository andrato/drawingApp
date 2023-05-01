
import { Button, ButtonProps } from "@mui/material";
import {
    Save,
    Publish,
    NoteAdd,
    RestartAlt,
} from '@mui/icons-material';
import { LocalStorageKeys } from "@/utils/constants/LocalStorage";
import { HandleActionsCanvasType } from "../types";
import { postDrawing } from "@/services/Drawings";
import { useState } from "react";
import { DrawingDialog } from "@/utils/helpers/DrawingDialog";

const ButtonStyled = ({children, ...props} : {children: React.ReactNode} & ButtonProps) => (
    <Button
        {...props}
        size="small"
        sx={(theme) => ({
            color: theme.palette.textCustom.primary,
            textTransform: 'none',
            fontSize: "12px",
            mr: "4px",
            ':hover': {
                backgroundColor: theme.palette.canvas.menuBtnHover,
            }
        })}
    >
        {children}
    </Button>
)

export function MenuTop ({
    handleClearCanvas,
    getDrawingVideo,
    getDrawingImage,
}: HandleActionsCanvasType) {
    /* Dialog stuff */
    const [open, setOpen] = useState(false);
    const dialogTitleReset = "Are you sure you want to start over?";
    const dialogDescriptionReset = "Once you 'Agree' with this, all your work will be lost. Please make sure you know what you are doing!";
        
    const showDialog = () => {
        setOpen(true);
    }

    const closeDialog = () => {
        setOpen(false);
    } 


    /* button actions from the top menu */
    const resetDrawing = () => {
        setOpen(false);
        handleClearCanvas();
    }

    const publishDrawing = () => {

    }

    const saveDrawing = async () => {
        const name = localStorage.getItem(LocalStorageKeys.FILENAME) ?? "UNKNOWN_2";
        const drawingVideoFile = getDrawingVideo();
        const drawingImageFile = await getDrawingImage();

        if (!drawingVideoFile) {
            console.log("video is null");
            return;
        }

        // we have the videoFile => send it to backend
        const formData = new FormData();
        formData.append('files', drawingVideoFile, name);
        formData.append('files', drawingImageFile, name);
        postDrawing(formData);
    }

    return (
        <>
            <>
                <ButtonStyled 
                    startIcon={<Save />}
                    onClick={saveDrawing}
                >
                    Save
                </ButtonStyled>
                <ButtonStyled startIcon={<Publish />}>
                    Publish
                </ButtonStyled>
                <ButtonStyled startIcon={<NoteAdd />}>
                    New file
                </ButtonStyled>
                <ButtonStyled 
                    startIcon={<RestartAlt />}
                    onClick={showDialog}
                >
                    Clear All
                </ButtonStyled>
            </>
            <DrawingDialog
                open={open} 
                title={dialogTitleReset} 
                description={dialogDescriptionReset} 
                onClose={closeDialog} 
                actionHandler={resetDrawing}
            /> 
        </>
    )
}