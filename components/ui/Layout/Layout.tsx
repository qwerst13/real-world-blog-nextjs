import { ReactNode } from 'react';
import { StyledEngineProvider } from '@mui/material/styles';

import { Header } from '../../Header';
import { ErrorBoundary } from '../../ErrorBoundary';

import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <StyledEngineProvider injectFirst>
      <div className={styles.container}>
        <ErrorBoundary>
          <Header />
        </ErrorBoundary>
        <ErrorBoundary>{children}</ErrorBoundary>
      </div>
    </StyledEngineProvider>
  );
}
