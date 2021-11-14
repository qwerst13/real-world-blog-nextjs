import { Button, Paper } from '@mui/material';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { DataToLogin } from '../../lib/types/apiResponses';

import styles from './Auth.module.scss';

const api = new ConduitServices();

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataToLogin>();

  const login: SubmitHandler<DataToLogin> = async ({ email, password }) => {
    const data = await api.login({ email, password });

    // TODO при ответе с сервера со статусом 200, но с ключом объекта errors: ['описание ошибки'] сделать соответствующий вывод
    console.log(data);
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
            <input type="email" placeholder="Email address" className={styles.input} {...register('email', { required: true })} />
          </div>

          <div className={styles.field}>
            <div className={styles.label}>
              <label htmlFor="password">Password</label>
            </div>
            <input type="password" placeholder="Password" className={styles.input} {...register('password', { required: true })} />
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
