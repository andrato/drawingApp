import { useState } from "react"
import { DialogDrawing } from "./DialogDrawing"
import { Button, TextField, Typography } from "@mui/material";
import { checkDrawing } from "@/services/Drawings";
import { LocalStorageKeys } from "@/utils/constants/LocalStorage";

export const StartingDialog = ({name, onFilenameChange, onClose}: {name: string | null, onFilenameChange: (name: string) => void, onClose: () => void}) => {
    const [open, setIsOpen] = useState<boolean>(!Boolean(name));
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: any) => {
        setLoading(true);
        event.stopPropagation();
        event.preventDefault();
        event.nativeEvent.stopImmediatePropagation();

        // remove localStorageKeys - should be removed, but just to be sure!
        localStorage.removeItem(LocalStorageKeys.DRAWING_ID);
        localStorage.removeItem(LocalStorageKeys.FILENAME);

        const data = new FormData(event.target);
        const nameValue = String(data.get("filename"));

        if (!nameValue || nameValue.length === 0) {
            setError("Name cannot be empty");
            setLoading(false);
            return;
        } 

        try {
            const {data} = await checkDrawing({name: nameValue});

            if (data.status) {
                setError(data?.error ?? "Please choose another name!");
                setLoading(false);
                return;
            }
        } catch (err) {
            setError("An error occured! Please try again later!");
            setLoading(false);
            return;
        }

        onFilenameChange(nameValue);
        setIsOpen(false);
    };

    return <DialogDrawing
        open={open}
        title="New drawing"
        onHandleClose={onClose}
    > 
        <form onSubmit={handleSubmit}>
            <Typography variant="body2" sx={{mb: 1}}>
                Select a name for the drawing:
            </Typography>
            <TextField
                hiddenLabel
                id="filename"
                variant="filled"
                size="small"
                name="filename"
                value={name}
                sx={{width: "100%", mb: error ? 1 : 3}}
            />
            {error && <Typography variant="body2" color="error" sx={{mb: 3}}>
                {error}
            </Typography>}
            <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={loading}
                sx={{
                    width: "100%",
                }}
            >
                Create Drawing
            </Button>
        </form>
    </DialogDrawing>
}