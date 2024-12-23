import { useState } from "react";
import { defaultButtons } from "./utils";

export function useButtonsLeft() {
    const [buttonsLeft, setButtonsLeft] = useState(defaultButtons);

    const setActiveButton = (id: string) => {
        const oldIndexActive = buttonsLeft.findIndex(elem => elem.isSelected);
        const newIndexActive = buttonsLeft.findIndex(elem => elem.id === id);

        const buttonsLeftNew = [...buttonsLeft];
        if (oldIndexActive !== -1) {
            buttonsLeftNew[oldIndexActive].isSelected = false;
        }

        if (newIndexActive !== -1) {
            buttonsLeftNew[newIndexActive].isSelected = true;
        }

        setButtonsLeft(buttonsLeftNew);
    }

    const getActiveButton = () => {
        const findIndexActive = buttonsLeft.findIndex(elem => elem.isSelected);

        if (findIndexActive !== -1) {
            return buttonsLeft[findIndexActive]?.id ?? undefined;
        }

        return undefined;
    }

    return {
        setActiveButton, 
        getActiveButton
    };
}