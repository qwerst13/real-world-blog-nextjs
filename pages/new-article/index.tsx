import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

import { ArticleForm } from '../../components/Forms/ArticleForm';

type ServerProps = InferGetStaticPropsType<typeof getStaticProps>;
interface NewArticlePageProps extends ServerProps {}

export default function NewArticlePage({}: NewArticlePageProps) {
  return (
    <>
      <Head>
        <title>Create new article</title>
        <meta name="description" content="Create new article" />
      </Head>

      <ArticleForm />
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
