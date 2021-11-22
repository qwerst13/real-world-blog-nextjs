import Head from 'next/head';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Pagination } from '@mui/material';

import { ArticlesList } from '../components/ArticlesList';
import { ConduitServices } from '../lib/services/ConduitServices';
import { Loader } from '../components/ui/Loader';

import styles from '../styles/HomePage.module.css';

const api = new ConduitServices();

type ServerProps = InferGetStaticPropsType<typeof getStaticProps>;
interface HomePageProps extends ServerProps {}

export default function HomePage({ _ }: HomePageProps) {
  const { data, error } = useSWR(`/api/articles?limit=20&offset=0`, () => api.getAllArticles());
  const router = useRouter();

  if (!data) return <Loader />;

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
      <Pagination className={styles.pagination} page={1} count={totalPages} onChange={(_, page) => router.push(`/${page}`)} />
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
