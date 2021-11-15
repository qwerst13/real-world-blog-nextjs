import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next';
import { SingleArticle } from '../../../lib/types/apiResponses';

import { Article } from '../../../components/Article';
import { CircularProgress } from '@mui/material';

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
  // TODO после создания класса-сервиса прописать пути
  return {
    paths: [{ params: { slug: 'Welcome-to-RealWorld-project-1' } }],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${params!.slug}`);
  const data: SingleArticle = await res.json();

  if (!data)
    return {
      notFound: true,
    };

  return {
    props: { data },
    revalidate: 30,
  };
};
