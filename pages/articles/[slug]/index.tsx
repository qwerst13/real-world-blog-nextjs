import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next';
import { CircularProgress } from '@mui/material';

import { Article } from '../../../components/Article';
import { ConduitServices } from '../../../lib/services/ConduitServices';

const api = new ConduitServices();

type singleArticlePageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function SingleArticlePage({ data }: singleArticlePageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="container">
        <CircularProgress className="centered" />
      </div>
    );
  }

  return <Article isFull={true} {...data.article} />;
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
  } catch (_) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data },
    revalidate: 30,
  };
};
