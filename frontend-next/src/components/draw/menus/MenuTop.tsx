
import { Button, ButtonProps } from "@mui/material";
import {
    Save,
    Publish,
    NoteAdd,
    RestartAlt,
} from '@mui/icons-material';

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

export function MenuTop ({resetDrawing}: {resetDrawing: Function}) {
   
    return (
        <>
            <>
                <ButtonStyled startIcon={<Save />}>
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
                    onClick={() => resetDrawing()}
                >
                    Clear All
                </ButtonStyled>
            </>
        </>
    )
}