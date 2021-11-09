import { ReactNode } from 'react';

import { Header } from '../../../components/Header';

import { StyledEngineProvider } from '@mui/material/styles';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <StyledEngineProvider injectFirst>
      <div className={styles.container}>
        <Header />
        {children}
      </div>
    </StyledEngineProvider>
  );
}
