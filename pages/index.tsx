import Head from 'next/head';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { SWRConfig } from 'swr';
import { Pagination } from '@mui/material';

import { ArticlesList } from '../components/ArticlesList';

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
      <Pagination className={styles.pagination} count={1} />
    </>
  );
}

//TODO подумать про использование т.к. это одна из 2-х страниц, которым потенциально нужна прегенерация
export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles?limit=20&offset=0`);
  const article = await response.json();

  return {
    props: {
      fallback: {
        '/api/article': article,
      },
    },
    revalidate: 30,
  };
};
