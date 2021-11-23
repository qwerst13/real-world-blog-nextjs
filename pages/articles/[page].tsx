import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Pagination } from '@mui/material';

import { ArticlesList } from '../../components/ArticlesList';
import { Loader } from '../../components/ui/Loader';
import { Alert } from '../../components/ui/Alert';
import { ConduitServices } from '../../lib/services/ConduitServices';

import styles from '../../styles/HomePage.module.scss';

const api = new ConduitServices();

interface PageProps {}

export default function HomePage({}: PageProps) {
  const router = useRouter();
  const page = +(router.query.page as string);
  const limit = 20;
  const offset = page * limit - limit;

  const { data, error } = useSWR(`/api/articles?limit=${limit}&offset=${offset}`, () => api.getAllArticles(limit, offset));

  if (error) {
    const message = error.message;
    return <Alert severity="error">{message}</Alert>;
  }

  if (!data) return <Loader />;

  if ('errors' in data) {
    const message = Object.entries(data.errors).join(' ');
    return <Alert severity="warning">{message}</Alert>;
  }

  const totalPages = Math.ceil(data.articlesCount / 20);
  return (
    <>
      <Head>
        <title>Realworld Blog</title>
        <meta name="description" content={`List of all articles, page ${page}`} />
      </Head>

      {!data.articles.length ? <Alert severity="warning">There no articles :(</Alert> : <ArticlesList {...data} />}

      <Pagination className={styles.pagination} page={page} count={totalPages} onChange={(_, page) => router.push(`/articles/${page}`)} />
    </>
  );
}
