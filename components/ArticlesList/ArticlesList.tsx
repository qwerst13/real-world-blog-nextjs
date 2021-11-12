import useSWR from 'swr';
import { CircularProgress } from '@mui/material';

import { fetcherWithAuth } from '../../lib/helpers/fetcher';
import { Article } from '../Article';
import { SingleArticle } from '../../lib/types/apiResponses';

export function ArticlesList() {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_URL}/articles?limit=20&offset=0`, fetcherWithAuth);

  // TODO добавить лоадер и показ ошибок
  if (!data)
    return (
      <div className="container">
        <CircularProgress className="centered" />
      </div>
    );

  if (error) return <div>Error</div>;

  const elements = data.articles.map((article: SingleArticle) => <Article key={article.slug} {...article} isFull={false} />);

  return <>{elements}</>;
}
