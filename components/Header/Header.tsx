import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';

import { proxyImage } from '../../lib/helpers/proxyImage';
import { useSession } from '../../lib/hooks/useSession';

import styles from './Header.module.scss';

export function Header() {
  const router = useRouter();
  const { currentUser, updateUser } = useSession();

  function logout() {
    updateUser(null);
    router.replace('/sign-in');
  }

  return (
    <div className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">Realworld Blog</Link>
      </div>
      <div className={styles.auth}>
        {!currentUser && (
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

        {currentUser && (
          <>
            <Button className={styles.create} size="small" variant="outlined">
              <Link href="/new-article">Create article</Link>
            </Button>
            <Link href="/profile">
              <a className={styles.username}>{currentUser.username}</a>
            </Link>
            <Link href="/profile" passHref>
              <a>
                <Image layout={'fixed'} className={styles.avatar} width={50} height={50} alt="user-image" src={proxyImage(currentUser.image)} />
              </a>
            </Link>
            <Button className={styles.logout} size="large" variant="outlined" onClick={logout}>
              Log out
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
