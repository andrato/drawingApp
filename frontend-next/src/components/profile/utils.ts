import * as Yup from 'yup';

export type EditProfileValuesType = {
    firstName: string;
    lastName: string;
    about: string;
}

export const EditSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('Required'),
    lastName: Yup.string()
        .required('Required'),
    about: Yup.string()
        .max(200, 'The description should not exceed 200 characters!')
        .optional(),
});

export const getIsValid = (values: EditProfileValuesType) => {
    try {
        EditSchema.validateSync(values);

        return true;
    } catch (e) {
        return false;
    }
}