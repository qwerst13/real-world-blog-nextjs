import { Button, Paper } from '@mui/material';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import classNames from 'classnames/bind';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { DataToLogin } from '../../lib/types/apiResponses';
import { emailValidationOptions, passwordValidationOptions } from '../../lib/helpers/validators';

import styles from './Auth.module.scss';

let cn = classNames.bind(styles);
const api = new ConduitServices();

interface FormData extends DataToLogin {}

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const login: SubmitHandler<FormData> = async ({ email, password }) => {
    const data = await api.login({ email, password });

    // TODO при ответе с сервера со статусом 200, но с ключом объекта errors: ['описание ошибки'] сделать соответствующий вывод
    if ('errors' in data) {
      const message = data.errors;
      console.log(message);
    } else {
      console.log(data);
    }
  };

  return (
    <div className={styles.container}>
      <Paper className={styles.paper} elevation={2}>
        <h3 className={styles.title}>Sign In</h3>

        <form onSubmit={handleSubmit(login)}>
          <div className={styles.field}>
            <div className={styles.label}>
              <label htmlFor="email">Email address</label>
            </div>
            <input
              type="email"
              placeholder="Email address"
              className={cn({ input: true, red: errors.email })}
              {...register('email', emailValidationOptions())}
            />
            {errors.email && <span className={styles['error-text']}>{errors.email.message}</span>}
          </div>

          <div className={styles.field}>
            <div className={styles.label}>
              <label htmlFor="password">Password</label>
            </div>
            <input
              type="password"
              placeholder="Password"
              className={cn({ input: true, red: errors.password })}
              {...register('password', passwordValidationOptions())}
            />
            {errors.password && <span className={styles['error-text']}>{errors.password.message}</span>}
          </div>

          <Button type="submit" className={styles.create} size="large" variant="contained">
            Login
          </Button>
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
