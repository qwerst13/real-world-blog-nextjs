import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { LoginForm } from '../../components/Forms';

type ServerProps = InferGetStaticPropsType<typeof getStaticProps>;
interface SignInPageProps extends ServerProps {}

export default function SignInPage({}: SignInPageProps) {
  return (
    <>
      <Head>
        <title>Log In</title>
        <meta name="description" content="Enter to account" />
      </Head>

      <LoginForm />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      inacessible: true,
    },
  };
};
