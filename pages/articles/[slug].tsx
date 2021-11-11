import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths, InferGetStaticPropsType } from 'next';
import { SingleArticle } from '../../lib/types/apiResponses';

import { Article } from '../../components/Article';
import { ConduitServices } from '../../lib/services/ConduitServices';
const api = new ConduitServices();

type singleArticlePageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function SingleArticlePage({ data }: singleArticlePageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <Article isFull={true} {...data.article} />;
}

export const getStaticPaths: GetStaticPaths = async () => {
  // TODO после создания класса-сервиса прописать пути
  return {
    paths: [{ params: { slug: 'Welcome-to-RealWorld-project-1' } }],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  //TODO запрос здесь при активной аутентификации подразумевает доступ к localStorage, чего нет не серверной стороне
  const data = await api.getArticle(params!.slug as string);

  return {
    props: { data },
    revalidate: 30,
  };
};
