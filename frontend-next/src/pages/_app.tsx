"use client"

import { Layout } from '@/components/utils/Layout';
import type { AppProps } from 'next/app';
import "./global.css";
import {ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wrapper } from './store';
import { makeThemeA } from '../../makeThemeA';
// import {Provider} from 'react-redux';

export const drawTheme = makeThemeA();

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
