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

  if (!data) return <Loader />;
  if (error) return <div>Ошибка</div>;

  if ('errors' in data) {
    const [errorMessage] = data.errors.body;

    if (errorMessage === 'Not found') router.push('/404');
    else {
      // TODO выдать ошибку
      return <div>Error</div>;
    }
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
      <ArticleForm isNew={false} slug={''} />
    </>
  );
}
