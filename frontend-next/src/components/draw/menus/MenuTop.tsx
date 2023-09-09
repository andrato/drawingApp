
import { Button, ButtonProps } from "@mui/material";
import {
    Save,
    Publish,
    NoteAdd,
    RestartAlt,
} from '@mui/icons-material';
import { LocalStorageKeys } from "@/components/utils/constants/LocalStorage";
import { HandleActionsCanvasType } from "../types";
import { DrawingResponseErrorType, postDrawing, publishDrawing } from "@/services/DrawingsInProgress";
import { useRef, useState } from "react";
import { DrawingDialog } from "@/components/utils/helpers/DrawingDialog";
import { FormikHelpers, useFormik } from "formik";
import { SaveValuesSchema, SaveValuesType, defaultSaveValues } from "./utils";
import { SaveValuesForm } from "./SaveValuesForm";
import { DialogDrawing } from "../utils/DialogDrawing";
import { AxiosError } from "axios";
import { upperFirst } from "lodash";
import { useLocalUser } from "@/components/common/helpers";

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
            },
            ':disabled': {
                color: theme.palette.textCustom.disabled,
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
    setForceNavigate,
}: HandleActionsCanvasType & {setForceNavigate: Function}) {
    const [openSave, setOpenSave] = useState(false);
    const [errorSave, setErrorSave] = useState<string|null>(null);
    const values = useRef<SaveValuesType>({...defaultSaveValues, title: localStorage.getItem(LocalStorageKeys.FILENAME) ?? ""});
    const [open, setOpen] = useState(false);
    const dialogTitleReset = "Are you sure you want to start over?";
    const dialogDescriptionReset = "Once you 'Agree' with this, all your work will be lost. Please make sure you know what you are doing!";
    const {isLoggedIn} = useLocalUser();

    /* Dialog stuff */
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

    const formData = async () => {
        const name = localStorage.getItem(LocalStorageKeys.FILENAME) ?? "UNKNOWN_2";
        let drawingVideoFile, drawingImageFile;

        try {
            drawingVideoFile = await getDrawingVideo();
            drawingImageFile = await getDrawingImage();
        } catch (err) {
            console.error ("Error occured when getting data");
            return;
        }
        
        if (!drawingVideoFile) {
            console.log("video is null");
            return;
        }

        // we have the videoFile => send it to backend
        const formData = new FormData();
        try {
            formData.append('files', drawingVideoFile, name);
            formData.append('files', drawingImageFile, name);
        } catch (err) {
            console.log("error on form data");
        }

        return formData;
    }

    const saveDrawing = async () => {
        const postData = await formData();

        if (!postData) {
            return;
        }

        try {
            const {data} = await postDrawing(postData);

            if (data?.drawingId) {
                localStorage.setItem(LocalStorageKeys.DRAWING_ID, data?.drawingId);
            }

            return data;
        } catch (err) {
            console.error ("Error occured when sending data");
            return;
        }
    }

    const publish = async (values: SaveValuesType) => {
        // request saveDrawing
        const save = await saveDrawing();

        if (!save) {
            setErrorSave("Video and/or image could not be saved! Please wait a little bit, and try again!");
            return;
        }

        // request doar cu values => asta o sa mute din drawingsInProgress in drawings
        let result;
        const title = upperFirst(values.displayTitle);
        try {
            result = await publishDrawing({...values, displayTitle: title});
        } catch (err) {
            const error = err as AxiosError<DrawingResponseErrorType>;
            const displayError = error?.response?.data?.error ?? "Failed to publish! Try again later!";
            setErrorSave(displayError);
            return;
        }

        if(result.data.status) {
            setErrorSave("Failed to publish!");
            return;
        }

        setOpenSave(false);
        setForceNavigate(true);
    }

    /* for final save */
    const formik = useFormik({
        initialValues: values.current,
        validationSchema: SaveValuesSchema,
        onSubmit: publish,
        validateOnBlur: true,
    })

    const handleClose = () => {
        setOpenSave(false);
        // formik.resetForm();
    }

    return (
        <>
            <>
                <ButtonStyled 
                    startIcon={<Save />}
                    onClick={saveDrawing}
                    disabled={!isLoggedIn}
                >
                    Save
                </ButtonStyled>
                <ButtonStyled 
                    startIcon={<Publish />}
                    onClick={() => setOpenSave(true)}
                    disabled={!isLoggedIn}
                >
                    Publish
                </ButtonStyled>
                {/* <ButtonStyled 
                    startIcon={<NoteAdd />}
                >
                    New file
                </ButtonStyled> */}
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

            <DialogDrawing
                open={openSave}
                title="Save drawing"
                onHandleClose={handleClose}
            >
                <form auto-complete="off" onSubmit={formik.handleSubmit}>
                    <SaveValuesForm 
                        values={formik.values}
                        errors={formik.errors}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        setFieldValue={formik.setFieldValue}
                        touched={formik.touched}
                        isSubmitting={formik.isSubmitting}
                        errorRequest={errorSave}
                    />
                </form>
            </DialogDrawing> 
        </>
    )
}