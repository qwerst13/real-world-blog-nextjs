import { ReactNode } from 'react';
import { Button, Dialog as DialogMui, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

interface DialogProps {
  children: ReactNode;
  title: string;
  open: boolean;
  onClose: () => void;
}

export function Dialog({ children, open, onClose, title }: DialogProps) {
  return (
    <DialogMui open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          OK
        </Button>
      </DialogActions>
    </DialogMui>
  );
}
