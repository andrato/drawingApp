import { Layout } from '@/utils/Layout';
import type { AppProps } from 'next/app';
import "./global.css";

export default function App({ Component, pageProps }: AppProps) {
    return <Layout>
        <Component {...pageProps} />
    </Layout>
}
