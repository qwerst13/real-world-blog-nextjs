import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { SWRConfig } from 'swr';

import { Layout } from '../components/ui/Layout';
import { Loader } from '../components/ui/Loader';
import { useSession } from '../lib/hooks/useSession';

import '../styles/globals.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { currentUser } = useSession();
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  useEffect(() => {
    setIsFirstLoad(false);
    if (pageProps.protected && !currentUser && !isFirstLoad) {
      router.replace('/sign-in');
    }

    if (pageProps.inacessible && !isFirstLoad && currentUser) {
      router.replace('/');
    }
  }, [isFirstLoad]);

  if ((pageProps.protected && !currentUser) || (pageProps.inacessible && !isFirstLoad && currentUser)) {
    return (
      <>
        <Head>
          <title>Loading...</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <Loader />
        </Layout>
      </>
    );
  }

  return (
    <SWRConfig>
      <Head>
        <title>Realworld App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
}
