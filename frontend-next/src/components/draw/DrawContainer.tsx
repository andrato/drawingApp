import { CanvasDraw, CanvasProps } from './CanvasDraw';
import { Box } from "@mui/material";
import React, { forwardRef } from 'react';
import { 
    handleActionsCanvasType,
} from "./types";

export const DrawContainer = forwardRef((props: CanvasProps, ref: React.Ref<handleActionsCanvasType>) => {
  return (
    <Box sx={{
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 0,
    }}>
        <CanvasDraw {...props} ref={ref}/>
    </Box>
  );
})