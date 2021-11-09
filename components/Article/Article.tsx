import { SingleArticle } from '../../lib/Types/apiResponses';
import { Paper, Rating } from '@mui/material';
import { FavoriteIcon, FavoriteBorderIcon } from '@mui/icons-material';

import Image from 'next/image';

import styles from './Article.module.scss';

interface ArticleProps extends SingleArticle {}

export function Article({ title, tagList, description, author: { username, image }, createdAt, favoritesCount, favorited }: ArticleProps) {
  return (
    <Paper className={styles.paper} elevation={2}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div className={styles.likes}>
            <Rating
              name="customized-color"
              defaultValue={0}
              getLabelText={(value: number) => `${value} Heart${value !== 1 ? 's' : ''}`}
              precision={1}
              icon={<FavoriteIcon fontSize="inherit" />}
              emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
            />
            {favoritesCount}
          </div>
        </div>
        <div className={styles.tags}>
          {/* TODO тэги */}
          <div className={styles.tag}>{'SomeTag'}</div>
          <div className={styles.tag}>{'SomeTag'}</div>
        </div>
        <div className={styles.description}>{description}</div>
      </div>
      <div className={styles.user}>
        <div className={styles.info}>
          <div className={styles.userName}>{username}</div>
          {/* TODO date-fns отображение даты */}
          <div className={styles.created}>{createdAt}</div>
        </div>
        <Image layout={'fixed'} className={styles.avatar} width={50} height={50} alt="user-image" src={image} />
      </div>
    </Paper>
  );
}
