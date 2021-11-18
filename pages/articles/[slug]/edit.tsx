import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';

import { ArticleForm } from '../../../components/Forms/ArticleForm';
import { CircularProgress } from '@mui/material';

type ServerProps = InferGetStaticPropsType<typeof getStaticProps>;

interface ProfilePageProps extends ServerProps {}

export default function ProfilePage({ slug }: ProfilePageProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Edit article</title>
        <meta name="description" content="Edit article" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* TODO заменить лоадер на что-то более приемлемое */}
      {router.isFallback && (
        <div className="container">
          <CircularProgress className="centered" />
        </div>
      )}
      <ArticleForm isNew={false} slug={slug} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // TODO после создания класса-сервиса прописать пути
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params!.slug;
  return {
    props: {
      slug,
    },
  };
};
