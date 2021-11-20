import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import classNames from 'classnames/bind';
import { Paper } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { DataToRegistration } from '../../lib/types/apiResponses';
import {
  usernameValidationOptions,
  emailValidationOptions,
  passwordValidationOptions,
  repeatPasswordValidationOptions,
  acceptValidationOptions,
} from '../../lib/helpers/validators';
import { useSession } from '../../lib/hooks/useSession';

import styles from '../../styles/Form.module.scss';
import { Input } from '../Input';

let cn = classNames.bind(styles);
const api = new ConduitServices();

interface FormData extends DataToRegistration {
  repeatPassword: string;
  rule: boolean;
}

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { updateUser } = useSession();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const registration: SubmitHandler<FormData> = async ({ username, email, password }) => {
    setIsLoading(true);
    const data = await api.register({ username, email, password });

    // TODO при ответе с сервера со статусом 200, но с ключом объекта errors: ['описание ошибки'] сделать соответствующий вывод, либо перенаправление на логин
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
        <h3 className={styles.title}>Create a new account</h3>
        <form onSubmit={handleSubmit(registration)}>
          <Input
            type="text"
            name="username"
            label="Username"
            placeholder="Username"
            error={errors.username}
            register={register}
            validationOptions={usernameValidationOptions()}
          />

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

          <Input
            type="password"
            name="repeatPassword"
            label="Repeat Password"
            placeholder="Password"
            error={errors.repeatPassword}
            register={register}
            validationOptions={repeatPasswordValidationOptions(watch('password'), watch('repeatPassword'))}
          />

          <hr className={styles.divider} />

          <div className={styles.rule}>
            <input className={cn({ rulebox: true, red: errors.rule })} type="checkbox" {...register('rule', acceptValidationOptions())} />
            <div className={styles.description}>
              <label htmlFor="rule">
                <span className={cn({ 'not-valid': errors.rule })}>I agree to the processing of my personal information</span>
              </label>
            </div>
          </div>

          <LoadingButton loading={isLoading} type="submit" className={styles.create} size="large" variant="contained">
            Create
          </LoadingButton>
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
