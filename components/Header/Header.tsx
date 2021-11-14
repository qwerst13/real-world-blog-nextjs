import { forwardRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { Button, CircularProgress } from '@mui/material';
import { parseJwtPayload } from '../../lib/helpers/parseJwtPayload';
import { getStorageItem } from '../../lib/helpers/localStorage';

import styles from './Header.module.scss';
import { proxyImage } from '../../lib/helpers/proxyImage';

export function Header() {
  const { data: currentUser } = useSWR('user', () => {
    const token = getStorageItem('jwt');

    return token ? parseJwtPayload(token) : undefined;
  });

  if (!currentUser) return <CircularProgress className="centered" />;

  const isAuth = true;

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">Realworld Blog</Link>
      </div>
      <div className={styles.auth}>
        {!isAuth && (
          <>
            <Link href="/sign-in" passHref>
              <Button className={styles.signin} size="large" variant="text">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up" passHref>
              <Button className={styles.signup} size="large" variant="outlined">
                Sign Up
              </Button>
            </Link>
          </>
        )}

        {isAuth && (
          <>
            <Button className={styles.create} size="small" variant="outlined">
              Create article
            </Button>
            <Link href="/profile">
              <a className={styles.username}>{currentUser.username}</a>
            </Link>
            <Link href="/profile" passHref>
              <a>
                <Image layout={'fixed'} className={styles.avatar} width={50} height={50} alt="user-image" src={proxyImage(currentUser.image)} />
              </a>
            </Link>
            <Button className={styles.logout} size="large" variant="outlined">
              Log out
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
