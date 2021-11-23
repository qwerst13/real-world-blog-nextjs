import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';

import { Article } from '../../../components/Article';
import { Loader } from '../../../components/ui/Loader';
import { Alert } from '../../../components/ui/Alert';
import { ConduitServices } from '../../../lib/services/ConduitServices';

const api = new ConduitServices();

type ServerProps = InferGetStaticPropsType<typeof getStaticProps>;
interface SingleArticlePageProps extends ServerProps {}

export default function SingleArticlePage({}: SingleArticlePageProps) {
  const router = useRouter();
  const { slug } = router.query;
  const { data, error } = useSWR(`/api/article/${slug}`, () => api.getArticle(slug as string));

  if (error) {
    if (error.status === 404) router.push('/404');

    const message = error.message;
    return <Alert severity="error">{message}</Alert>;
  }

  if (router.isFallback || !data) return <Loader />;

  if ('errors' in data) {
    const message = Object.entries(data.errors).join(' ');
    return <Alert severity="warning">{message}</Alert>;
  }

  return (
    <>
      <Head>
        <title>{data.article.title}</title>
        <meta name="description" content={data.article.description} />
      </Head>

      <Article isFull={true} {...data.article} />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articles = await api.getAllArticles();
  if ('errors' in articles)
    return {
      paths: [],
      fallback: true,
    };

  const paths = articles.articles.map(({ slug }) => ({ params: { slug } }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  let data;

  try {
    data = await api.getArticle(params!.slug as string);

    if (!('errors' in data)) {
      const { article } = data;

      return {
        props: {
          fallback: {
            [`/api/article/${article.slug}`]: article,
          },
        },
        revalidate: 1,
      };
    }
  } catch (_) {
    return {
      notFound: true,
    };
  }

  return {
    notFound: true,
  };
};
