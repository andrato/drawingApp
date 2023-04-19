
import { IconButton, IconButtonProps, Input } from "@mui/material";
import { useButtonsLeft } from "./useButtonsLeft";
import {
    Create,
    Brush,
    SquareOutlined,
    CircleOutlined,
} from '@mui/icons-material';
import {
    FaEraser,
    FaPenNib,
} from "react-icons/fa";

const IconButtonStyled = ({
    children, 
    onHandleClickLeft, 
    id,
    ...props
} : {
    children: React.ReactNode, 
    onHandleClickLeft: Function
    id: string,
} & IconButtonProps) => {
    const {getActiveButton} = useButtonsLeft();
    const isSelected = getActiveButton() === id;

    return (<div>
        <IconButton
            {...props}
            size="small"
            onClick={(e) => onHandleClickLeft(e)}
            id={id}
            sx={(theme) => ({
                color: theme.palette.textCustom.primary,
                textTransform: 'none',
                fontSize: "16px",
                borderRadius: "4px",
                mb: "4px",
                cursor: "default",
                backgroundColor: isSelected ? theme.palette.canvas.menuBtnActive : theme.palette.canvas.menuBg,
                ':hover': {
                    backgroundColor: isSelected ? theme.palette.canvas.menuBtnActive : theme.palette.canvas.menuBtnHover,
                },
            })}
        >
            {children}
        </IconButton>
    </div>)
}

export function MenuLeft ({color, setColor} : {color: string, setColor: Function}) {
    /* for left buttons */
    const { setActiveButton } = useButtonsLeft();

    const onHandleClickLeft = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setActiveButton(e.currentTarget.id);
    }

    return (
        <>
            <IconButtonStyled id="pencil" onHandleClickLeft={onHandleClickLeft}>
                <Create fontSize="small"/>
            </IconButtonStyled>
            <IconButtonStyled id="brush" onHandleClickLeft={onHandleClickLeft}>
                <Brush fontSize="small"/>
            </IconButtonStyled>
            <IconButtonStyled id="pen" onHandleClickLeft={onHandleClickLeft}>
                <FaPenNib style={{padding: "2px"}}/>
            </IconButtonStyled>
            <IconButtonStyled id="eraser" onHandleClickLeft={onHandleClickLeft}>
                <FaEraser style={{padding: "2px"}}/>
            </IconButtonStyled>
            <IconButtonStyled id="square" onHandleClickLeft={onHandleClickLeft}>
                <SquareOutlined fontSize="small"/>
            </IconButtonStyled>
            <IconButtonStyled id="circle" onHandleClickLeft={onHandleClickLeft}>
                <CircleOutlined fontSize="small"/>
            </IconButtonStyled>

            <Input 
                type="color" 
                name="favcolor" 
                value={color} 
                onChange={(event) => setColor(event.target.value)}
                disableUnderline={true}
                sx={{
                    width: "30px",
                    p: 0,
                    m: 0,
                    mb: "4px",
                    '& .MuiInputBase-input': {
                        height: "30px",
                        p: 0,
                    }
                }}
            />
        </>
    )
}