import { createSlice } from "@reduxjs/toolkit";
import { CanvasElem } from "../draw/types";

const startingLayers: CanvasElem[] = []

export const layersSlice = createSlice({
    name: "layers",
    initialState: {value: startingLayers},
    reducers: {
        create: (state, action) => {
            state.value = action.payload;
        },
        update: (state, action) => {
            state.value = action.payload;
        },
        add: (state, action) => {
            state.value.forEach((elem, index) => {
                elem.selected = false;
            })
            state.value.push(action.payload);
        },
        deleteByName: (state, action) => {
            const index = state.value.findIndex((layer) => layer.name === action.payload);
            delete state.value[index];
        },
        deleteByIndex: (state, action) => {
            delete state.value[action.payload];
        }
    }
})

export const {create, update, add, deleteByName, deleteByIndex} = layersSlice.actions;