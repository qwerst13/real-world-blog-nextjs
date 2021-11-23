import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { ArticleForm } from '../../../components/Forms';
import { Loader } from '../../../components/ui/Loader';
import { Alert } from '../../../components/ui/Alert';
import { ConduitServices } from '../../../lib/services/ConduitServices';

const api = new ConduitServices();

type ServerProps = InferGetStaticPropsType<typeof getStaticProps>;
interface EditArticlePageProps extends ServerProps {}

export default function EditArticlePage({}: EditArticlePageProps) {
  const router = useRouter();
  const { slug } = router.query;
  const { data, error } = useSWR(`/api/article/${slug}`, () => api.getArticle(slug as string));

  if (error) {
    if (error.status === 404) router.push('/404');

    const message = error.message;
    return <Alert severity="error">{message}</Alert>;
  }

  if (!data) return <Loader />;

  if ('errors' in data) {
    const message = Object.entries(data.errors).join(' ');
    return <Alert severity="warning">{message}</Alert>;
  }

  return (
    <>
      <Head>
        <title>Edit article</title>
        <meta name="description" content="Edit article" />
      </Head>

      <ArticleForm articleData={data.article} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      protected: true,
    },
  };
};
