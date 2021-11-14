import useSWR from 'swr';
import { CircularProgress } from '@mui/material';

import { Article } from '../Article';
import { SingleArticle } from '../../lib/types/apiResponses';
import { ConduitServices } from '../../lib/services/ConduitServices';

export function ArticlesList() {
  const api = new ConduitServices();
  const { data, error } = useSWR(`/articles`, () => api.getAllArticles());

  // TODO добавить лоадер и показ ошибок
  if (!data)
    return (
      <div className="container">
        <CircularProgress className="centered" />
      </div>
    );

  if (error || 'errors' in data) return <div>Error</div>;

  const elements = data.articles.map((article: SingleArticle) => <Article key={article.slug} {...article} isFull={false} />);

  return <>{elements}</>;
}
