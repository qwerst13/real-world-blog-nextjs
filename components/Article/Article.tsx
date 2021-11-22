import { useEffect, useRef, useState, MouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classnames from 'classnames/bind';
import ReactMarkdown from 'react-markdown';
import { Paper, Button, Popper } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

import { Tags } from '../Tags';
import { Heart } from '../ui/Heart';
import { GetArticle, SingleArticle, Error } from '../../lib/types/apiResponses';
import { formatDate } from '../../lib/helpers/formatDate';
import { proxyImage } from '../../lib/helpers/proxyImage';
import { ConduitServices } from '../../lib/services/ConduitServices';
import { useSession } from '../../lib/hooks/useSession';

import styles from './Article.module.scss';

const cn = classnames.bind(styles);
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
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { currentUser } = useSession();
  const router = useRouter();
  const isOwner = currentUser?.username === username;

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

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'confirmation-popper' : undefined;

  function toggleConfirmationDialog(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
  }

  function editArticle() {
    router.push(`/articles/${slug}/edit`);
  }

  async function deleteArticle() {
    const response = await api.deleteArticle(slug);
    if (typeof response !== 'boolean') return;
    // TODO отобразить ошибку
    else router.replace('/');
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
      <div className={styles['user-container']}>
        <div className={styles.user}>
          <div className={styles.info}>
            <div className={styles.userName}>{username}</div>
            <div className={styles.created}>{formatDate(createdAt)}</div>
          </div>
          <Image layout={'fixed'} className={styles.avatar} width={50} height={50} alt="user-image" src={proxyImage(image)} />
        </div>
        {isFull && isOwner && (
          <div className={styles.controls}>
            <Button className={cn('button', 'delete')} variant="outlined" aria-describedby={id} onClick={toggleConfirmationDialog}>
              Delete
            </Button>
            <Popper id={id} open={open} anchorEl={anchorEl} placement="right-start" disablePortal={false}>
              <Paper className={styles.popper}>
                <div className={styles.dialog}>
                  <ErrorIcon sx={{ color: 'orange' }} />
                  <div className={styles.warning}>Are you sure to delete this article?</div>
                </div>
                <div className={styles.controls}>
                  <Button variant="outlined" size="small" className={cn('button')} onClick={toggleConfirmationDialog}>
                    No
                  </Button>
                  <Button variant="contained" size="small" className={cn('button')} onClick={deleteArticle}>
                    Yes
                  </Button>
                </div>
              </Paper>
            </Popper>
            <Button className={cn('button', 'edit')} variant="outlined" onClick={editArticle}>
              Edit
            </Button>
          </div>
        )}
      </div>
      {isFull && (
        <div className={styles.body}>
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
      )}
    </Paper>
  );
}
