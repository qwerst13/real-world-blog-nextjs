import { Paper } from '@mui/material';
import { useForm, SubmitHandler } from 'react-hook-form';
import classNames from 'classnames/bind';
import LoadingButton from '@mui/lab/LoadingButton';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { UserData } from '../../lib/types/apiResponses';
import { usernameValidationOptions, emailValidationOptions, avatarUrlValidationOptions } from '../../lib/helpers/validators';
import { useSession } from '../../lib/hooks/useSession';
import { Input } from '../Input';

import styles from '../../styles/Form.module.scss';
import { useState } from 'react';

let cn = classNames.bind(styles);
const api = new ConduitServices();

interface FormData extends UserData {
  password: string;
}

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { currentUser, updateUser } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { username: currentUser?.username, email: currentUser?.email, image: currentUser?.image, bio: currentUser?.bio },
  });

  const updateProfile: SubmitHandler<FormData> = async ({ username, email, image, bio }) => {
    setIsLoading(true);
    const data = await api.updateCurrentUser({ username, email, bio, image });

    // TODO при ответе с сервера со статусом 200, но с ключом объекта errors: ['описание ошибки'] сделать соответствующий вывод, либо перенаправление на логин
    if ('errors' in data) {
      const message = data.errors;
      console.log(message);
    } else {
      // TODO модалка об успешном обновлении профиля
      updateUser(data.user);
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Paper className={cn('paper')} elevation={2}>
        <h3 className={styles.title}>Edit Profile</h3>
        <form onSubmit={handleSubmit(updateProfile)}>
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
            type="text"
            name="image"
            label="Avatar image (url)"
            placeholder="Avatar image"
            error={errors.image}
            register={register}
            validationOptions={avatarUrlValidationOptions()}
          />

          <Input
            type="textarea"
            rows={3}
            name="bio"
            label="Tell something about you"
            placeholder="But not too much ;)"
            error={errors.image}
            register={register}
          />

          <LoadingButton loading={isLoading} type="submit" className={styles.create} size="large" variant="contained">
            Save
          </LoadingButton>
        </form>
      </Paper>
    </div>
  );
}
