import { ReactNode } from 'react';
import { Alert as AlertMui, AlertTitle } from '@mui/material';

import styles from './Alert.module.scss';

interface AlertProps {
  children: ReactNode;
  severity: 'error' | 'warning' | 'info' | 'success';
}

export function Alert({ children, severity }: AlertProps) {
  const titleMessage = severity[0].toUpperCase() + severity.slice(1);

  return (
    <div className="centered">
      <AlertMui severity={severity} className={styles.alert}>
        <AlertTitle>{titleMessage}</AlertTitle>
        {children}
      </AlertMui>
    </div>
  );
}
