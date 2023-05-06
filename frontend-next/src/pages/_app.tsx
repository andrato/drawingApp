import { Layout } from '@/utils/Layout';
import type { AppProps } from 'next/app';
import "./global.css";
import {ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const drawTheme = createTheme({
    palette: {
        backgroundCustom: {
            main: "#272727",
            light: "#272727",
            dark: "#1b1b1b",
            hover: "#3a4922",
            active: "#4A661D",
        },
        textCustom: {
            primary: "#d7d7d7",
            secondary: "#17a1fa",
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

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {    
    return <ThemeProvider theme={drawTheme}>
        <QueryClientProvider client={queryClient}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </QueryClientProvider>
    </ThemeProvider>
}
