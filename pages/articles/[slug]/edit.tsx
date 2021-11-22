import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';

import { ArticleForm } from '../../../components/Forms/ArticleForm';
import { ConduitServices } from '../../../lib/services/ConduitServices';
import { Loader } from '../../../components/ui/Loader';

const api = new ConduitServices();

export default function EditArticlePage() {
  const router = useRouter();
  const { slug } = router.query;
  const { data, error } = useSWR(`/api/article/${slug}`, () => api.getArticle(slug as string));

  if (error) {
    if (error.status === 404) router.push('/404');
    // TODO отображение ошибки
    else return <div>Ошибка</div>;
  }
  if (!data) return <Loader />;

  if ('errors' in data) {
    // TODO выдать ошибку
    return <div>Error</div>;
  }

  return (
    <>
      <Head>
        <title>Edit article</title>
        <meta name="description" content="Edit article" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* TODO заменить лоадер на что-то более приемлемое */}
      {router.isFallback && <Loader />}
      <ArticleForm articleData={data.article} />
    </>
  );
}
