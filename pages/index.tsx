import { ChangeEvent, useState } from 'react';
import Head from 'next/head';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import useSWR from 'swr';
import { CircularProgress, Pagination } from '@mui/material';

import { ArticlesList } from '../components/ArticlesList';
import { ConduitServices } from '../lib/services/ConduitServices';

import styles from '../styles/HomePage.module.css';

const api = new ConduitServices();

type ServerProps = InferGetStaticPropsType<typeof getStaticProps>;
interface HomePageProps extends ServerProps {}

export default function HomePage({ _ }: HomePageProps) {
  const [page, setPage] = useState<number>(1);
  const limit = 20;
  const offset = page * limit - limit;

  const { data, error } = useSWR(`/api/articles?limit=${limit}&offset=${offset}`, () => api.getAllArticles(limit, offset));

  if (!data)
    return (
      <div className="container">
        <CircularProgress className="centered" />
      </div>
    );

  // TODO добавить показ ошибок
  if (error || 'errors' in data) return <div>Error</div>;

  const totalPages = Math.ceil(data.articlesCount / 20);
  return (
    <>
      <Head>
        <title>Realworld Blog</title>
        <meta name="description" content="List of all articles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ArticlesList {...data} />
      <Pagination className={styles.pagination} page={page} count={totalPages} onChange={(_, page) => setPage(page)} />
    </>
  );
}

//TODO подумать про использование т.к. это одна из 2-х страниц, которым потенциально нужна прегенерация
export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles?limit=20&offset=0`);
  const articles = await response.json();

  return {
    props: {
      fallback: {
        '/api/articles?limit=20&offset=0': articles,
      },
    },
    revalidate: 30,
  };
};
