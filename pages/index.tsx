import { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Pagination } from '@mui/material';

import { ArticlesList } from '../components/ArticlesList';
import { Loader } from '../components/ui/Loader';
import { Alert } from '../components/ui/Alert';
import { ConduitServices } from '../lib/services/ConduitServices';

import styles from '../styles/HomePage.module.scss';

const api = new ConduitServices();

type ServerProps = InferGetStaticPropsType<typeof getStaticProps>;
interface HomePageProps extends ServerProps {}

export default function HomePage({ _ }: HomePageProps) {
  const { data, error } = useSWR(`/api/articles?limit=20&offset=0`, () => api.getAllArticles());
  const router = useRouter();

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
        <meta name="description" content="List of all articles" />
      </Head>

      <ArticlesList {...data} />
      <Pagination className={styles.pagination} page={1} count={totalPages} onChange={(_, page) => router.push(`/articles/${page}`)} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const articles = await api.getAllArticles();

  return {
    props: {
      fallback: {
        '/api/articles?limit=20&offset=0': articles,
      },
    },
    revalidate: 1,
  };
};
