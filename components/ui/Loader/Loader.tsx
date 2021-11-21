import { CircularProgress } from '@mui/material';

export function Loader() {
  return (
    <div className="container">
      <CircularProgress className="centered" />
    </div>
  );
}
