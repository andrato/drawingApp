"use client"

import { Layout } from '@/components/utils/Layout';
import type { AppProps } from 'next/app';
import "./global.css";
import {ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wrapper } from './store';
// import {Provider} from 'react-redux';

const drawTheme = createTheme({
    palette: {
        backgroundCustom: {
            main: "#272727",
            light: "#333333",
            dark: "#1b1b1b",
            hover: "#16a1fb42",
            active: "#4A661D",
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
    const { store, props } = wrapper.useWrappedStore(pageProps);

    return <ThemeProvider theme={drawTheme}>
        <QueryClientProvider client={queryClient}>
            <Layout>
                {/* <Provider store={store}>  */}
                    <Component {...pageProps} />
                {/* </Provider> */}
            </Layout>
        </QueryClientProvider>
    </ThemeProvider>
}
