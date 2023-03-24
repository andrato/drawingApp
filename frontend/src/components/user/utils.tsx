import * as Yup from 'yup';
import {memoize} from 'lodash';

export enum Step {
    SIGNIN = "signin",
    SIGNUP = "signup",
    SUCCESS = "success",
    ERROR = "error"
}

export type SignInValuesType = {
    email: string;
    password: string;
}

export type SignUpValuesType = {
    firstName: string;
    lastName: string;

    email: string;
    password: string;
}

export const SigninSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email!')
        .required('Required'),
    password: Yup.string()
        // .min(8, 'Password should contain at least 8 characters!')
        .required('Required'),
});

export const SignUpSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('Required'),
    lastName: Yup.string()
        .required('Required'),
    email: Yup.string()
        .email('Invalid email!')
        .required('Required'),
    password: Yup.string()
        .min(8, 'Password should contain at least 8 characters!')
        .required('Required'),
});

export const getIsValid = (values: SignInValuesType | SignUpValuesType, step: Step.SIGNIN | Step.SIGNUP) => {
    try {
        if (step === Step.SIGNIN ) {
            SigninSchema.validateSync(values);
        } else {
            SignUpSchema.validateSync(values);
        }

        return true;
    } catch (e) {
        return false;
    }
}

// ToDo: remove it? not much difference with memoize
export const getValidationSignInSchema = memoize(() => {
    return Yup.object().shape({
        email: Yup.string()
        .email('Invalid email!')
        .required('Required'),
        password: Yup.string()
        // .min(8, 'Password should contain at least 8 characters!')
        .required('Required'),
    })
});