import { useState } from "react";

const defaultButtonsSettings = [
    {
        id: "settings",
        isSelected: true, 
    },
    {
        id: "history",
        isSelected: false, 
    },
    {
        id: "color",
        isSelected: false, 
    },
]

const defaultButtonsLayers = [
    {
        id: "layers",
        isSelected: true, 
    },
    {
        id: "channels",
        isSelected: false, 
    },   
]

export function useButtonsRight() {
    const [buttonsSettings, setButtonsSettings] = useState(defaultButtonsSettings);
    const [buttonsLayers, setButtonsLayers] = useState(defaultButtonsLayers);

    function setActiveButtonSettings(id: string) {
        const oldIndexActive = buttonsSettings.findIndex(elem => elem.isSelected);
        const newIndexActive = buttonsSettings.findIndex(elem => elem.id === id);

        const buttonsLeftNew = [...buttonsSettings];
        if (oldIndexActive !== -1) {
            buttonsLeftNew[oldIndexActive].isSelected = false;
        }

        if (newIndexActive !== -1) {
            buttonsLeftNew[newIndexActive].isSelected = true;
        }

        setButtonsSettings(buttonsLeftNew);
    }

    function getActiveButtonSettings() {
        const findIndexActive = buttonsSettings.findIndex(elem => elem.isSelected);

        if (findIndexActive !== -1) {
            return buttonsSettings[findIndexActive]?.id ?? undefined;
        }

        return undefined;
    }

    function setActiveButtonLayers(id: string) {
        const oldIndexActive = buttonsLayers.findIndex(elem => elem.isSelected);
        const newIndexActive = buttonsLayers.findIndex(elem => elem.id === id);

        const buttonsLeftNew = [...buttonsLayers];
        if (oldIndexActive !== -1) {
            buttonsLeftNew[oldIndexActive].isSelected = false;
        }

        if (newIndexActive !== -1) {
            buttonsLeftNew[newIndexActive].isSelected = true;
        }

        setButtonsLayers(buttonsLeftNew);
    }

    function getActiveButtonLayers() {
        const findIndexActive = buttonsLayers.findIndex(elem => elem.isSelected);

        if (findIndexActive !== -1) {
            return buttonsLayers[findIndexActive]?.id ?? undefined;
        }

        return undefined;
    }

    return {
        setActiveButtonSettings, 
        getActiveButtonSettings,
        setActiveButtonLayers,
        getActiveButtonLayers,
    };
}
