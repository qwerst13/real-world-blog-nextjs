import Head from 'next/head';

import { SignUpForm } from '../../components/SignUpForm';

export default function SignUpPage() {
  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Sign up to get access" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignUpForm />
    </>
  );
}
