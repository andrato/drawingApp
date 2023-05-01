import * as Yup from 'yup';

export type SaveValuesType = {
    title: string;
    description: string,
    categories: string[];
}

export const defaultSaveValues = {
    title: "",
    description: "",
    categories: [],
}

export const SaveValuesSchema = Yup.object().shape({
    title: Yup.string()
        .required('Required'),
    categories: Yup.array()
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