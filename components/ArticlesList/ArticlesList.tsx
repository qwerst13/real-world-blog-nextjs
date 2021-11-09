import useSWR from 'swr';

import { fetcher } from '../../lib/helpers/fetcher';
import { Article } from '../Article';
import { SingleArticle } from '../../lib/Types/apiResponses';

export function ArticlesList() {
  const { data, error } = useSWR('https://api.realworld.io/api/articles?limit=20&offset=0', fetcher);

  // TODO добавить лоадер и показ ошибок
  if (!data) return <div>loading...</div>;

  if (error) return <div>Error</div>;

  const elements = data.articles.map((article: SingleArticle) => <Article key={article.slug} {...article} />);

  return <>{elements}</>;
}
