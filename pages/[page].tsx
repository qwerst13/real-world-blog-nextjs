import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Pagination } from '@mui/material';

import { ArticlesList } from '../components/ArticlesList';
import { ConduitServices } from '../lib/services/ConduitServices';
import { Loader } from '../components/ui/Loader';

import styles from '../styles/HomePage.module.css';

const api = new ConduitServices();

interface PageProps {}

export default function HomePage({}: PageProps) {
  const router = useRouter();
  const page = +(router.query.page as string);
  const limit = 20;
  const offset = page * limit - limit;

  const { data, error } = useSWR(`/api/articles?limit=${limit}&offset=${offset}`, () => api.getAllArticles(limit, offset));

  if (!data) return <Loader />;

  // TODO добавить показ ошибок
  // TODO обработать ситуацию с превышением допустимой страницы приходит articles: []
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
      <Pagination className={styles.pagination} page={page} count={totalPages} onChange={(_, page) => router.push(`/${page}`)} />
    </>
  );
}
