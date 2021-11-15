import Head from 'next/head';

import { ProfileForm } from '../../components/Forms';

export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>Log In</title>
        <meta name="description" content="Enter to account" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ProfileForm />
    </>
  );
}
