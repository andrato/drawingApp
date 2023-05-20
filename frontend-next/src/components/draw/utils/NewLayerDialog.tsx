import { useState } from "react"
import { DialogDrawing } from "./DialogDrawing"
import { Button, TextField, Typography } from "@mui/material";
import { CanvasElem } from "../types";

export const NewLayerDialog = ({
    name,
    open, 
    onHandleChange, 
    onClose, 
    layers, 
}: { 
    name: string | null;
    open: boolean;
    onHandleChange: (name: string) => void;
    onClose: () => void;
    layers: CanvasElem[];
}) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        
        setLoading(true);

        const data = new FormData(event.target);
        const nameValue = String(data.get("layerName"));

        const elemExisting = layers.find((elem) => elem.name === nameValue);

        if (elemExisting) {
            setError("Layer name already existing! Please select another one");
            setLoading(false);
            return;
        }

        onHandleChange(nameValue);
        setLoading(false);
        onClose();
    };

    return <DialogDrawing
        open={open}
        title="Choose a name for the layer"
        onHandleClose={onClose}
    > 
        <form onSubmit={handleSubmit}>
            <TextField
                hiddenLabel
                id="layerName"
                variant="filled"
                size="small"
                name="layerName"
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
                Create layer
            </Button>
        </form>
    </DialogDrawing>
}