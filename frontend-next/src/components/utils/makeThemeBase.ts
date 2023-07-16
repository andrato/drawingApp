// import { PaletteOptions, ThemeOptions, TypeText, createTheme } from "@mui/material";
// import { PaletteColor, PaletteColorOptions } from "@mui/material";

// // type ThemeExtraOptions

// type BackgroundCustom = PaletteColor & {
//     hover: string, 
//     active: string, 
//     navHover: string, 
//     star: string,
//     profileInfo: string,
// };      

// type TextCustom = {primary: string, secondary: string, hover: string, subHeader: string};

// type Canvas = {
//     menuBg: string,
//     menuBtnHover: string,
//     menuBtnActive: string,
//     bgColor: string,
//     slider: string,
// };

// type SizesCustom = {
//     navbarHeight: string,
//     linkWidth: string,
//     linkHeight: string,
//     fontSizeText: string,
//     fontSizeButtonsText: string,

//     drawTopMenuHeight: string,
//     drawLeftMenuWidth: string,
//     drawRightMenuWidth: string,
//     drawBorderHeight: string,
//     drawFontSizeMenuText: string,
// }

// type ThemeCustom = ThemeOptions & {
//     palette: PaletteOptions & {backgroundCustom: BackgroundCustom, textCustom: TextCustom, canvas: Canvas};
//     customSizes: SizesCustom;
// }

// export const makeThemeBase = (options: ThemeOptions, /*extraOptions: ThemeExtraOptions*/) => {
//     const customVal: ThemeCustom = {
//         ...options,
//         palette: {
//             backgroundCustom: {
//                 main: "#272727",
//                 light: "#333333",
//                 dark: "#1b1b1b",
//                 hover: "#16a1fb42",
//                 active: "#4A661D",
//                 profileInfo: "#4c4c4c",
//                 contrastText: "#1b1b1b",
//                 navHover: "#16a1fa75",
//                 star: "#be9b48",
//             },
//             textCustom: {
//                 primary: "#d7d7d7",
//                 secondary: "#17a1fa",
//                 subHeader: "#828282",
//                 focus: "#92c939",
//                 hover: "#111111",
//                 disabled: "#111111",
//             },
//             primary: {
//                 main: "#3fa0e0",
//                 light: "#77c3f6",
//             },
//             canvas: {
//                 menuBg: "#545454",
//                 menuBtnHover: "#3d3d3d",
//                 menuBtnActive: "#2d2d2d",
//                 bgColor: "#2d2d2d",
//                 slider: "#cdcdcd",
//             }
//         },
//         customSizes: {
//             navbarHeight: "58px",
//             linkWidth: "132px", 
//             linkHeight: "30px", 
//             fontSizeText: "11px",
//             fontSizeButtonsText: "12px",
    
//             drawTopMenuHeight: "34px",
//             drawLeftMenuWidth: "34px",
//             drawRightMenuWidth: "260px",
//             drawBorderHeight: "2px",
//             drawFontSizeMenuText: "12px",
//         }
//     }

//     const newTheme = createTheme(makeThemeBase)
// }