import Head from 'next/head';

import { LoginForm } from '../../components/Forms';

export default function SignInPage() {
  return (
    <>
      <Head>
        <title>Log In</title>
        <meta name="description" content="Enter to account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginForm />
    </>
  );
}
