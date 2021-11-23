import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Paper } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { DataToLogin } from '../../lib/types/apiResponses';
import { emailValidationOptions, passwordValidationOptions } from '../../lib/helpers/validators';
import { useSession } from '../../lib/hooks/useSession';
import { Input } from '../Input';
import { Dialog } from '../ui/Dialog';

import styles from '../../styles/Form.module.scss';

const api = new ConduitServices();

interface FormData extends DataToLogin {}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();
  const { updateUser } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const login: SubmitHandler<FormData> = async ({ email, password }) => {
    setIsLoading(true);

    try {
      const data = await api.login({ email, password });

      if ('errors' in data) {
        setErrorMessage(Object.entries(data.errors).join(' '));
        setIsLoading(false);
        setIsOpen(true);
      } else {
        updateUser(data.user);
        setIsLoading(false);
        router.push('/');
      }
    } catch (e) {
      setErrorMessage('Something went wrong. Check your Internet connection and try again.');
      setIsLoading(false);
      setIsOpen(true);
    }
  };

  function closeDialog() {
    setIsOpen(false);
  }

  return (
    <div className={styles.container}>
      <Paper className={styles.paper} elevation={2}>
        <h3 className={styles.title}>Sign In</h3>

        <form onSubmit={handleSubmit(login)}>
          <Input
            type="email"
            name="email"
            label="Email address"
            placeholder="Email address"
            error={errors.email}
            register={register}
            validationOptions={emailValidationOptions()}
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Password"
            error={errors.password}
            register={register}
            validationOptions={passwordValidationOptions()}
          />

          <LoadingButton loading={isLoading} type="submit" className={styles.create} size="large" variant="contained">
            Login
          </LoadingButton>
        </form>

        <div className={styles.change}>
          Don’t have an account?{' '}
          <Link href="/sign-up">
            <a className={styles.link}>Sign Up</a>
          </Link>
        </div>
      </Paper>

      <Dialog open={isOpen} onClose={closeDialog} title="Login error">
        {errorMessage}
      </Dialog>
    </div>
  );
}
