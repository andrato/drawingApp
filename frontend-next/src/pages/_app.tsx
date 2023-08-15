"use client"

import { Layout } from '@/components/utils/Layout';
import type { AppProps } from 'next/app';
import "./global.css";
import {ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wrapper } from './store';
import { makeThemeA } from '../../makeThemeA';
// import {Provider} from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export const drawTheme = makeThemeA();

export const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {  
    const { store, props } = wrapper.useWrappedStore(pageProps);

    return <ThemeProvider theme={drawTheme}>
        <QueryClientProvider client={queryClient}>
            <Layout>
                {/* <Provider store={store}>  */}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Component {...pageProps} />
                </LocalizationProvider>
                {/* </Provider> */}
            </Layout>
        </QueryClientProvider>
    </ThemeProvider>
}
