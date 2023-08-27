import { Avatar, Box, Card, CardContent, CardHeader, Chip, IconButton, Theme, Typography } from "@mui/material"
import { getNameInitials, isSameUser, isUserLoggedIn } from "../common/helpers";
import { DeleteOutline, EditOutlined, FileDownloadOutlined } from "@mui/icons-material";
import { useRef, useState } from "react";
import { DrawingDialog } from "../utils/helpers/DrawingDialog";
import { useRouter } from "next/router";
import { HOST_DRAWING, deleteDrawing, modifyDrawing } from "@/services/Drawings";
import { DialogDrawing} from "../draw/utils/DialogDrawing";
import { SaveValuesForm } from "../draw/menus/SaveValuesForm";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { SaveValuesSchema, SaveValuesType } from "../draw/menus/utils";
import { useQueryClient } from "@tanstack/react-query";
import { isEqual } from "lodash";

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
    title,
    displayTitle,
    description,
    labels
}: {
    userId: string;
    userName: string;
    imgPath: string;
    date: number;
    drawingVideoPath?: string;
    drawingImagePath?: string;
    title: string;
    displayTitle: string;
    description?: string;
    labels?: string[];
}) => {
    const [openDeleteDrawing, setOpenDeleteDrawing] = useState<boolean>(false);
    const [openEditDrawing, setOpenEditDrawing] = useState<boolean>(false);
    const {firstNameInitial, lastNameInitial} = getNameInitials({userName: userName});
    const formatDate = (new Date(date)).toDateString();
    const sameUser = isSameUser(userId) && isUserLoggedIn();
    const router = useRouter();
    const id = router.query.id as string;
    const queryClient = useQueryClient();

    const handleDelete = async () => {
        try {
            await deleteDrawing(id);
        } catch (err) {
            alert("Deleting drawing failed");
            setOpenDeleteDrawing(false);
            return;
        }

        router.push("/gallery");
    }

    const handleEdit = async (values: SaveValuesType) => {
        if (isEqual(defaultSaveValues, values)) {
            alert("No changes made! Please make some changes before pressing `Edit`");
            return;
        }

        try {
            const drawing = await modifyDrawing({
                drawingId: id, 
                ...values,
            });

            queryClient.setQueryData([HOST_DRAWING, id], {data: {drawing: drawing.data.drawing}});
        } catch (err) {
            alert("Modify drawing failed");
        }

        setOpenEditDrawing(false);
    }

    /* for final save */
    const defaultSaveValues = {
        title,
        displayTitle,
        description: description ?? "",
        labels: labels ?? [],
    }
    const values = useRef<SaveValuesType>(defaultSaveValues);
    const [errorSave, setErrorSave] = useState<string|null>(null);
    const formik = useFormik({
        initialValues: defaultSaveValues,
        validationSchema: SaveValuesSchema,
        onSubmit: handleEdit,
        validateOnBlur: true,
    })

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
                        {sameUser && <>
                            <IconButton component="a" href={drawingVideoPath}>
                                <FileDownloadOutlined 
                                sx={(theme) => ({
                                    color: theme.palette.textCustom.primary,
                                })}/>
                            </IconButton>
                            <IconButton onClick={() => {openDeleteDrawing && setOpenDeleteDrawing(false); setOpenEditDrawing(true);}}>
                                <EditOutlined 
                                    sx={(theme) => ({
                                        color: theme.palette.textCustom.primary,
                                    })}
                                />
                            </IconButton>
                            <IconButton onClick={() => {openEditDrawing && setOpenEditDrawing(false); setOpenDeleteDrawing(true);}}>
                                <DeleteOutline 
                                    sx={(theme) => ({
                                        color: theme.palette.textCustom.primary,
                                    })}
                                />
                            </IconButton>
                            </>
                        }
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
                    {labels?.map((label, index) => {
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
                {description && <Box sx={{mt: 3,}}>
                    <Typography variant="subtitle2" color={"textCustom.primary"}>
                        Description
                    </Typography>
                    <Typography variant="body2" color={"textCustom.primary"} sx={{mt: 1}}>
                        {description}
                    </Typography>
                </Box>}
            </CardContent>
            <DrawingDialog
                title="Delete Drawing"
                open={openDeleteDrawing}
                description={"Are you sure you want to delete the drawing?"}
                onClose={() => {
                    setOpenDeleteDrawing(false);
                }}
                actionHandler={handleDelete}
            />
            <DialogDrawing
                open={openEditDrawing}
                title="Save drawing"
                onHandleClose={() => setOpenEditDrawing(false)}
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
                        showTitle={false}
                        buttonText="Edit drawing"
                    />
                </form>
            </DialogDrawing> 
        </Card>
    )
}