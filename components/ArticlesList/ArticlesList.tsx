import { Article } from '../Article';
import { AllArticles } from '../../lib/types/apiResponses';

interface ArticlesListProps extends AllArticles {}

export function ArticlesList({ articles }: ArticlesListProps) {
  const elements = articles.map((article) => <Article key={article.slug} {...article} isFull={false} />);

  return <>{elements}</>;
}
