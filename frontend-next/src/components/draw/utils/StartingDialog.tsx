import { useState } from "react"
import { DialogDrawing } from "./DialogDrawing"
import { Button, TextField, Typography } from "@mui/material";

export const StartingDialog = ({name, onFilenameChange}: {name: string | null, onFilenameChange: (name: string) => void}) => {
    const [open, setIsOpen] = useState<boolean>(!Boolean(name));
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (event: any) => {
        event.stopPropagation();
        event.preventDefault();
        event.nativeEvent.stopImmediatePropagation();

        const data = new FormData(event.target);
        const name = String(data.get("filename"));

        if (!name || name.length === 0) {
            setError("Name cannot be null");
        } else {
            onFilenameChange(name);
            setIsOpen(false);
        }
    };

    return <DialogDrawing
        open={open}
        title="New drawing"
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
                sx={{width: "100%", mb: error ? 1 : 3}}
            />
            {error && <Typography variant="body2" color="error" sx={{mb: 3}}>
                {error}
            </Typography>}
            <Button
                type="submit"
                variant="contained"
                color="success"
                sx={{
                    width: "100%",
                }}
            >
                Create Drawing
            </Button>
        </form>
    </DialogDrawing>
}