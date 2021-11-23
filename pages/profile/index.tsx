import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { ProfileForm } from '../../components/Forms';

type ServerProps = InferGetStaticPropsType<typeof getStaticProps>;
interface ProfilePageProps extends ServerProps {}

export default function ProfilePage({}: ProfilePageProps) {
  return (
    <>
      <Head>
        <title>Log In</title>
        <meta name="description" content="Profile" />
      </Head>

      <ProfileForm />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      protected: true,
    },
  };
};
