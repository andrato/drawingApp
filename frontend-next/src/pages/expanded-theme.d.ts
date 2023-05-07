import { PaletteColor, PaletteColorOptions } from "@mui/material";

declare module '@mui/material/styles' {
    interface Palette {
		backgroundCustom: PaletteColor & {
            hover: string, 
            active: string, 
            navHover: string, 
            star: string
        };
        textCustom: Partial<TypeText> & {hover: string}; 
        canvas: {
            menuBg: string,
            menuBtnHover: string,
            menuBtnActive: string,
            bgColor: string,
            slider: string,
        };
    }
    interface PaletteOptions {
        backgroundCustom: PaletteColor & {
            hover: string, 
            active: string, 
            navHover: string, 
            star: string
        };        
        textCustom?: Partial<TypeText> & {hover: string};
        canvas?: {
            menuBg: string,
            menuBtnHover: string,
            menuBtnActive: string,
            bgColor: string,
            slider: string,
        };
    }

    interface Theme {
        customSizes: {
            navbarHeight: string,
            linkWidth: string,
            linkHeight: string,
            fontSizeText: string,
            fontSizeButtonsText: string,

            drawTopMenuHeight: string,
            drawLeftMenuWidth: string,
            drawRightMenuWidth: string,
            drawBorderHeight: string,
            drawFontSizeMenuText: string,
        };
    }
    interface ThemeOptions {
        customSizes?: {
            navbarHeight: string,
            linkWidth: string,
            linkHeight: string,
            fontSizeText: string,
            fontSizeButtonsText: string,

            drawTopMenuHeight: string,
            drawLeftMenuWidth: string,
            drawRightMenuWidth: string,
            drawBorderHeight: string,
            drawFontSizeMenuText: string,
        };
    }
}