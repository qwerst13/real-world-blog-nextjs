import { useState } from 'react';
import { Paper } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Image from 'next/image';
import Link from 'next/link';

import { SingleArticle } from '../../lib/types/apiResponses';
import { formatDate } from '../../lib/helpers/formatDate';

import styles from './Article.module.scss';

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
  const [isFavorite, setIsFavorite] = useState<boolean>(favorited);

  function onLike() {
    // TODO запрос на сервер
    setIsFavorite((prevState) => !prevState);
  }

  const tags = tagList.map((tag) => (
    <div key={tag} className={styles.tag}>
      {tag}
    </div>
  ));

  return (
    <Paper className={styles.paper} elevation={2}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Link href={`/articles/${slug}`}>{title}</Link>
          </div>
          <div className={styles.likes}>
            <div className={styles.likeCount}>{favoritesCount}</div>
            {isFavorite ? (
              <FavoriteIcon onClick={onLike} className={styles['heart-active']} fontSize="inherit" />
            ) : (
              <FavoriteBorderIcon onClick={onLike} className={styles.heart} fontSize="inherit" />
            )}
          </div>
        </div>
        <div className={styles.tags}>{tags}</div>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.user}>
        <div className={styles.info}>
          <div className={styles.userName}>{username}</div>
          <div className={styles.created}>{formatDate(createdAt)}</div>
        </div>
        <Image layout={'fixed'} className={styles.avatar} width={50} height={50} alt="user-image" src={image} />
      </div>
      {isFull && <div className={styles.body}>{body}</div>}
    </Paper>
  );
}
