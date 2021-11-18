import Image from 'next/image';
import Link from 'next/link';

import ReactMarkdown from 'react-markdown';
import { Paper } from '@mui/material';

import { Tags } from '../Tags';
import { Heart } from '../Heart';
import { GetArticle, SingleArticle, Error } from '../../lib/types/apiResponses';
import { formatDate } from '../../lib/helpers/formatDate';
import { proxyImage } from '../../lib/helpers/proxyImage';
import { ConduitServices } from '../../lib/services/ConduitServices';

import styles from './Article.module.scss';
import { useEffect, useState } from 'react';

const api = new ConduitServices();

interface ArticleProps extends SingleArticle {
  isFull: boolean;
}

export function Article({
  title,
  tagList,
  description,
  author: { username, image },
  createdAt,
  favoritesCount,
  favorited,
  slug,
  body,
  isFull,
}: ArticleProps) {
  const [likesCount, setlikesCount] = useState<number>(favoritesCount);
  const [isFavorited, setIsFavorited] = useState<boolean>(favorited);

  //This effect update server-side data since it doesn't know about authentication
  useEffect(() => {
    setIsFavorited(favorited);
  }, [favorited]);

  async function handleLike() {
    let article: GetArticle | Error;
    if (isFavorited) {
      article = await api.unfavoriteArticle(slug);
    } else {
      article = await api.favoriteArticle(slug);
    }

    if (!('errors' in article)) {
      const { favorited, favoritesCount } = article.article;

      setlikesCount(favoritesCount);
      setIsFavorited(favorited);
    }
  }

  return (
    <Paper className={styles.paper} elevation={2}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Link href={`/articles/${slug}`}>{title}</Link>
          </div>
          <Heart count={likesCount} favorited={isFavorited} onClick={handleLike} />
        </div>
        <Tags tagList={tagList} />
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.user}>
        <div className={styles.info}>
          <div className={styles.userName}>{username}</div>
          <div className={styles.created}>{formatDate(createdAt)}</div>
        </div>
        <Image layout={'fixed'} className={styles.avatar} width={50} height={50} alt="user-image" src={proxyImage(image)} />
      </div>
      {isFull && (
        <div className={styles.body}>
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
      )}
    </Paper>
  );
}
