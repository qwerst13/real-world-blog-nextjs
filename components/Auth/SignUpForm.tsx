import { Button, Paper } from '@mui/material';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import classNames from 'classnames/bind';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { DataToRegistration } from '../../lib/types/apiResponses';
import {
  usernameValidationOptions,
  emailValidationOptions,
  passwordValidationOptions,
  repeatPasswordValidationOptions,
  acceptValidationOptions,
} from '../../lib/helpers/validators';

import styles from './Auth.module.scss';

let cn = classNames.bind(styles);
const api = new ConduitServices();

interface FormData extends DataToRegistration {
  repeatPassword: string;
  rule: boolean;
}

export function SignUpForm() {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const registration: SubmitHandler<FormData> = async ({ username, email, password }) => {
    const data = await api.register({ username, email, password });

    // TODO при ответе с сервера со статусом 200, но с ключом объекта errors: ['описание ошибки'] сделать соответствующий вывод, либо перенаправление на логин
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
        <h3 className={styles.title}>Create a new account</h3>
        <form onSubmit={handleSubmit(registration)}>
          <div className={styles.field}>
            <div className={styles.label}>
              <label htmlFor="username">Username</label>
            </div>
            <input
              type="text"
              placeholder="Username"
              className={cn({ input: true, red: errors.username })}
              {...register('username', usernameValidationOptions())}
            />
            {errors.username && <span className={styles['error-text']}>{errors.username.message}</span>}
          </div>

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

          <div className={styles.field}>
            <div className={styles.label}>
              <label htmlFor="repeatPassword">Repeat Password</label>
            </div>
            <input
              type="password"
              placeholder="Password"
              className={cn({ input: true, red: errors.repeatPassword })}
              {...register('repeatPassword', repeatPasswordValidationOptions(watch('password'), watch('repeatPassword')))}
            />
            {errors.repeatPassword && <span className={styles['error-text']}>{errors.repeatPassword.message}</span>}
          </div>

          <hr className={styles.divider} />

          <div className={styles.rule}>
            <input className={cn({ rulebox: true, red: errors.rule })} type="checkbox" {...register('rule', acceptValidationOptions())} />
            <div className={styles.description}>
              <label htmlFor="rule">
                <span className={cn({ 'not-valid': errors.rule })}>I agree to the processing of my personal information</span>
              </label>
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
