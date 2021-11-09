import Head from 'next/head';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { SWRConfig } from 'swr';

import { ArticlesList } from '../components/ArticlesList/ArticlesList';

import styles from '../styles/HomePage.module.css';

export default function HomePage({ fallback }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Realworld Blog</title>
        <meta name="description" content="List of all articles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SWRConfig value={{ fallback }}>
        <ArticlesList />
      </SWRConfig>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch('https://api.realworld.io/api/articles?limit=20&offset=0');
  const article = await response.json();

  return {
    props: {
      fallback: {
        '/api/article': article,
      },
    },
  };
};
