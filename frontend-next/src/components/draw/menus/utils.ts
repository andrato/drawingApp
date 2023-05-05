import * as Yup from 'yup';

export type SaveValuesType = {
    displayTitle: string;
    title: string;
    description: string,
    categories: string[];
}

export const defaultSaveValues = {
    displayTitle: "",
    title: "",
    description: "",
    categories: [],
}

export const SaveValuesSchema = Yup.object().shape({
    displayTitle: Yup.string()
        .required('Required'),
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