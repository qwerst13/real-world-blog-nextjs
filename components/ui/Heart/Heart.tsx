import classNames from 'classnames/bind';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { useSession } from '../../../lib/hooks/useSession';

import styles from './Heart.module.scss';

const cn = classNames.bind(styles);

interface HeartProps {
  count: number;
  favorited: boolean;
  onClick: () => void;
}

export function Heart({ count, favorited, onClick }: HeartProps) {
  const { currentUser } = useSession();

  let heart: JSX.Element;
  if (!currentUser) heart = <FavoriteBorderIcon className={styles.disabled} fontSize="inherit" />;
  else
    heart = favorited ? (
      <FavoriteIcon onClick={onClick} className={cn('heart', 'active')} fontSize="inherit" />
    ) : (
      <FavoriteBorderIcon onClick={onClick} className={styles.heart} fontSize="inherit" />
    );

  return (
    <div className={styles.likes}>
      <div className={styles.likeCount}>{count}</div>
      {heart}
    </div>
  );
}
