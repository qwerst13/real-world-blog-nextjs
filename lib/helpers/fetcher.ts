import { ConduitServices } from '../services/ConduitServices';

interface CustomError extends Error {
  info: string;
  status: number;
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error: Partial<CustomError> = new Error('An error occurred while fetching the data.');

    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export const fetcherWithAuth = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${ConduitServices.getStorageItem('jwt')}`,
    },
  });

  if (!res.ok) {
    const error: Partial<CustomError> = new Error('An error occurred while fetching the data.');

    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};
