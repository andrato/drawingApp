import { FormikHelpers, useFormik } from "formik";
import { DialogUser } from "../user/DialogUser";
import { useMemo } from "react";
import { modifyProfile } from "@/services/User";
import { EditProfileValuesType, EditSchema } from "./utils";
import { EditProfileForm } from "./EditProfileForm";
import { useProfileUser } from "./useProfileUser";
import { upperFirst } from "lodash";

export const ProfileEditDialog = ({
    isOpen, 
    setIsOpen,
    userId,
} : {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    userId: string;
}) => {
    const {user, modifyUser} = useProfileUser(userId);

    const values = useMemo(() => (
        {firstName: user?.firstName ?? "", lastName: user?.lastName ?? "", about: user?.profile.about ?? ''}
    ), [user]);

    const handleSubmit = async (values: EditProfileValuesType, {resetForm}: FormikHelpers<EditProfileValuesType>) => {
        const firstName = upperFirst(values.firstName);
        const lastName = upperFirst(values.lastName);
        let updated = false;

        let modifiedValues: any = {
            userId: userId,
            firstName: undefined,
            lastName: undefined,
            about: undefined,
        };

        if (firstName !== user?.firstName) {
            modifiedValues.firstName = firstName;
            updated = true;
        }
        if (lastName !== user?.lastName) {
            modifiedValues.lastName = lastName;
            updated = true;
        }
        if(values.about && values.about !== user?.profile?.about) {
            modifiedValues.about = values.about;
            updated = true;
        }

        if (!updated) {
            alert ("Nothing to update!");
            return;
        } else {
            modifiedValues.userId = userId;
        }

        try {
            await modifyProfile(modifiedValues);

            modifyUser(modifiedValues);
            setIsOpen(false);
        } catch (err: any) {
            console.error("Error is: " + JSON.stringify(err));
            setIsOpen(false);
        }

        // close modal and display error / success message
    }

    const formik = useFormik({
        initialValues: values,
        validationSchema: EditSchema,
        onSubmit: handleSubmit,
        validateOnBlur: true,
    })

    return <DialogUser onHandleClose={() => setIsOpen(false)} open={isOpen} title="Edit profile" size={400}>    
        <form auto-complete="off" onSubmit={formik.handleSubmit}>
            <EditProfileForm 
                values={formik.values}
                errors={formik.errors}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                touched={formik.touched}
                isSubmitting={formik.isSubmitting}
            />
        </form>          
    </DialogUser>
}