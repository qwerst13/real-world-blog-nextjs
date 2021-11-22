import { Component, ErrorInfo } from 'react';
import { Alert } from '@mui/material';

export default class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error(error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    return hasError ? <Alert severity="error">Something went wrong...</Alert> : children;
  }
}
