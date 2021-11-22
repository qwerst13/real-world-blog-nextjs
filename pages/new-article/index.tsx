import Head from 'next/head';

import { ArticleForm } from '../../components/Forms/ArticleForm';

export default function NewArticlePage() {
  return (
    <>
      <Head>
        <title>Create new article</title>
        <meta name="description" content="Create new article" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ArticleForm />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      protected: true,
    },
  };
}
