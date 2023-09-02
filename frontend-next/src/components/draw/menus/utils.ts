import * as Yup from 'yup';

export enum SessionStorageVars {
    FILL_SHAPE_COLOR = 'fillColor',
    IS_SAME_COLOR = 'sameColor',
    OPACITY = 'opacity',
    LINE_WIDTH = 'lineWidth',
    LINE_COLOR = 'color',
}

export enum Buttons {
    PENCIL = 'pencil',
    BRUSH = 'brush',
    PEN = 'pen',
    ERASER = 'eraser',
    SQUARE = 'square',
    CIRCLE = 'circle',
}
export type ButtonsType = {id: Buttons, isSelected: boolean}[];

export const defaultButtons = [
{
    id: Buttons.PENCIL,
    isSelected: false, 
},
{
    id: Buttons.BRUSH,
    isSelected: true, 
},
{
    id: Buttons.PEN,
    isSelected: false, 
},
{
    id: Buttons.ERASER,
    isSelected: false, 
},
{
    id: Buttons.SQUARE,
    isSelected: false, 
},
{
    id: Buttons.CIRCLE,
    isSelected: false, 
},
]

export type SaveValuesType = {
    displayTitle: string;
    title: string;
    description: string,
    labels: string[];
}

export const defaultSaveValues = {
    displayTitle: "",
    title: "",
    description: "",
    labels: [],
}

export const SaveValuesSchema = Yup.object().shape({
    displayTitle: Yup.string()
        .required('Required'),
    title: Yup.string()
        .required('Required'),
    labels: Yup.array()
        .optional(),
    description: Yup.string()
        .optional(),
});

export const getIsValid = (values: SaveValuesType) => {
    try {
        SaveValuesSchema.validateSync(values);
        return true;
    } catch (e) {
        return false;
    }
}