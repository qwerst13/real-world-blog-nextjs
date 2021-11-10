import Link from 'next/link';
import { Button } from '@mui/material';

import styles from './Header.module.scss';

export function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">Realworld Blog</Link>
      </div>
      <div className={styles.nonauthorized}>
        <Button className={styles.signin} variant="text">
          Sign In
        </Button>
        <Button className={styles.signup} variant="outlined">
          Sign Up
        </Button>
      </div>
      <div className={styles.authorized}></div>
    </div>
  );
}
