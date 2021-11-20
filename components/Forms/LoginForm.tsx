import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import classNames from 'classnames/bind';
import { Paper } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { DataToLogin } from '../../lib/types/apiResponses';
import { emailValidationOptions, passwordValidationOptions } from '../../lib/helpers/validators';
import { useSession } from '../../lib/hooks/useSession';

import styles from '../../styles/Form.module.scss';
import { Input } from '../Input';

let cn = classNames.bind(styles);
const api = new ConduitServices();

interface FormData extends DataToLogin {}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { updateUser } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const login: SubmitHandler<FormData> = async ({ email, password }) => {
    setIsLoading(true);
    const data = await api.login({ email, password });

    // TODO при ответе с сервера со статусом 200, но с ключом объекта errors: ['описание ошибки'] сделать соответствующий вывод
    // TODO не забыть отключить загрузку в кнопке при ошибке
    if ('errors' in data) {
      const message = data.errors;
      console.log(message);
    } else {
      updateUser(data.user);
      router.push('/').then(() => setIsLoading(false));
    }
  };

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
    </div>
  );
}
