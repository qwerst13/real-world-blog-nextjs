import { Button, Paper } from '@mui/material';
import Link from 'next/link';

import styles from './Auth.module.scss';
import { FormEvent } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { DataToRegistration } from '../../lib/types/apiResponses';

const api = new ConduitServices();

export function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataToRegistration>();

  const registration: SubmitHandler<DataToRegistration & { repeatPassword: string; rule: boolean }> = async ({
    username,
    email,
    password,
    repeatPassword,
    rule,
  }) => {
    // TODO добавить нормальную валидацию
    if (password === repeatPassword) {
      if (rule) {
        const data = await api.register({ username, email, password });

        // TODO при ответе с сервера со статусом 200, но с ключом объекта errors: ['описание ошибки'] сделать соответствующий вывод, либо перенаправление на логин
        console.log(data);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Paper className={styles.paper} elevation={2}>
        <h3 className={styles.title}>Create a new account</h3>
        <form onSubmit={handleSubmit(registration)}>
          <div className={styles.field}>
            <div className={styles.label}>
              <label htmlFor="username">Username</label>
            </div>
            <input type="text" placeholder="Username" className={styles.input} {...register('username', { required: true })} />
          </div>

          <div className={styles.field}>
            <div className={styles.label}>
              <label htmlFor="email">Email address</label>
            </div>
            <input type="email" id="email" placeholder="Email address" className={styles.input} />
          </div>

          <div className={styles.field}>
            <div className={styles.label}>
              <label htmlFor="password">Password</label>
            </div>
            <input type="password" id="password" placeholder="Password" className={styles.input} />
          </div>

          <div className={styles.field}>
            <div className={styles.label}>
              <label htmlFor="repeatPassword">Repeat Password</label>
            </div>
            <input type="password" id="repeatPassword" placeholder="Password" className={styles.input} />
          </div>

          <hr className={styles.divider} />

          <div className={styles.rule}>
            <input className={styles.rulebox} id="rule" type="checkbox" />
            <div className={styles.description}>
              <label htmlFor="rule">I agree to the processing of my personal information</label>
            </div>
          </div>

          <Button type="submit" className={styles.create} size="large" variant="contained">
            Create
          </Button>
        </form>

        <div className={styles.change}>
          Already have an account?{' '}
          <Link href="/sign-in">
            <a className={styles.link}>Sign In</a>
          </Link>
        </div>
      </Paper>
    </div>
  );
}
