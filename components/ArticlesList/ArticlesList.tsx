import useSWR from 'swr';
import { CircularProgress, Pagination } from '@mui/material';

import { Article } from '../Article';
import { SingleArticle } from '../../lib/types/apiResponses';
import { ConduitServices } from '../../lib/services/ConduitServices';
import styles from '../../styles/HomePage.module.css';

export function ArticlesList() {
  const api = new ConduitServices();
  const { data, error, isValidating } = useSWR(`/api/articles`, () => api.getAllArticles());
  console.log(data);
  console.log(isValidating);

  // TODO добавить лоадер и показ ошибок
  if (!data)
    return (
      <div className="container">
        <CircularProgress className="centered" />
      </div>
    );

  if (error || 'errors' in data) return <div>Error</div>;

  const elements = data.articles.map((article: SingleArticle) => <Article key={article.slug} {...article} isFull={false} />);

  return (
    <>
      {elements}
      <Pagination className={styles.pagination} count={Math.ceil(data.articlesCount / 20)} />
    </>
  );
}
