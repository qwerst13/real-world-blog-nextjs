import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Layout } from '../lib/ui/Layout';
import { SWRConfig } from 'swr';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
}
