import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import useSWR from 'swr';

import { Article } from '../../../components/Article';
import { ConduitServices } from '../../../lib/services/ConduitServices';
import { Loader } from '../../../components/ui/Loader';

const api = new ConduitServices();

type ServerProps = InferGetStaticPropsType<typeof getStaticProps>;
interface singleArticlePageProps extends ServerProps {}

export default function SingleArticlePage({ _ }: singleArticlePageProps) {
  const router = useRouter();
  const { slug } = router.query;
  const { data, error } = useSWR(`/api/article/${slug}`, () => api.getArticle(slug as string));

  if (router.isFallback || !data) return <Loader />;

  // TODO добавить компонент ошибки
  if ('errors' in data || error) return <div>Error</div>;

  return (
    <>
      <Head>
        <title>{data.article.title}</title>
        <meta name="description" content={data.article.description} />
        <link rel="icon" href="/favicon.ico" />
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
        revalidate: 30,
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
