import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { SignUpForm } from '../../components/Forms';

type ServerProps = InferGetStaticPropsType<typeof getStaticProps>;
interface SignUpPageProps extends ServerProps {}

export default function SignUpPage({}: SignUpPageProps) {
  return (
    <>
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Sign up to get access" />
      </Head>

      <SignUpForm />
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
