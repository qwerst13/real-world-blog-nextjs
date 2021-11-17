import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';

import { Layout } from '../lib/ui/Layout';
import { useSession } from '../lib/hooks/useSession';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { currentUser } = useSession();
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  useEffect(() => {
    setIsFirstLoad(false);
    if (!currentUser && !isFirstLoad) {
      router.replace('/sign-in');
    }
  }, [isFirstLoad]);

  if (pageProps.protected && !currentUser) {
    return (
      <Layout>
        <div className="centered">Loading...</div>
      </Layout>
    );
  }

  return (
    <SWRConfig>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
}
