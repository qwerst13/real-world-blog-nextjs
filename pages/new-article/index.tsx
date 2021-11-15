import Head from 'next/head';
import { GetStaticProps, InferGetStaticPropsType } from 'next';

import { ArticleForm } from '../../components/Forms/ArticleForm';

export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>Create new article</title>
        <meta name="description" content="Create new article" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ArticleForm isNew={true} />
    </>
  );
}
