import { createTheme } from "@mui/material";

export const makeThemeA = () => {
    const drawTheme = createTheme({
        palette: {
            backgroundCustom: {
                main: "#272727",
                light: "#333333",
                dark: "#1b1b1b",
                hover: "#16a1fb42",
                active: "#4A661D",
                profileInfo: "#4c4c4c",
                contrastText: "#1b1b1b",
                navHover: "#16a1fa75",
                star: "#be9b48",
            },
            textCustom: {
                primary: "#d7d7d7",
                secondary: "#17a1fa",
                subHeader: "#828282",
                focus: "#92c939",
            },
            primary: {
                main: "#3fa0e0",
                light: "#77c3f6",
            },
            canvas: {
                menuBg: "#545454",
                menuBtnHover: "#3d3d3d",
                menuBtnActive: "#2d2d2d",
                bgColor: "#2d2d2d",
                slider: "#cdcdcd",
            },
            error: {
                light: "#d65454",
                main: "#d65454",
                dark: "#b45050",
                contrastText: "#d7d7d7",
            },
            success: {
                light: "#9b62be",
                main: "#9b62be",
                dark: "#744890",
                contrastText: "#d7d7d7",
            }
        },
        customSizes: {
            navbarHeight: "58px",
            linkWidth: "132px", 
            linkHeight: "30px", 
            fontSizeText: "11px",
            fontSizeButtonsText: "12px",

            drawTopMenuHeight: "34px",
            drawLeftMenuWidth: "34px",
            drawRightMenuWidth: "260px",
            drawBorderHeight: "2px",
            drawFontSizeMenuText: "12px",
        }
    });

    return drawTheme;
}