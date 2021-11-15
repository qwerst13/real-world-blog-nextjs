import { Button, Paper } from '@mui/material';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import classNames from 'classnames/bind';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { UserData } from '../../lib/types/apiResponses';
import { usernameValidationOptions, emailValidationOptions, avatarUrlValidationOptions } from '../../lib/helpers/validators';

import styles from './Form.module.scss';
import { useSession } from '../../lib/hooks/useSession';

let cn = classNames.bind(styles);
const api = new ConduitServices();

interface FormData extends UserData {
  password: string;
}

export function ProfileForm() {
  const { currentUser, updateUser } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { username: currentUser?.username, email: currentUser?.email, image: currentUser?.image, bio: currentUser?.bio },
  });

  const updateProfile: SubmitHandler<FormData> = async ({ username, email, image, bio }) => {
    const data = await api.updateCurrentUser({ username, email, bio, image });

    // TODO при ответе с сервера со статусом 200, но с ключом объекта errors: ['описание ошибки'] сделать соответствующий вывод, либо перенаправление на логин
    if ('errors' in data) {
      const message = data.errors;
      console.log(message);
    } else {
      // TODO модалка об успешном обновлении профиля
      updateUser(data.user);
    }
  };

  return (
    <div className={styles.container}>
      <Paper className={styles.paper} elevation={2}>
        <h3 className={styles.title}>Edit Profile</h3>
        <form onSubmit={handleSubmit(updateProfile)}>
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
              <label htmlFor="image">Avatar image (url)</label>
            </div>
            <input
              type="text"
              placeholder="Avatar image"
              className={cn({ input: true, red: errors.image })}
              {...register('image', avatarUrlValidationOptions())}
            />
            {errors.image && <span className={styles['error-text']}>{errors.image.message}</span>}
          </div>

          <div className={styles.field}>
            <div className={styles.label}>
              <label htmlFor="bio">Tell something about you</label>
            </div>
            <textarea cols={3} placeholder="But not too much ;)" className={cn({ area: true, red: errors.bio })} {...register('bio')} />
            {errors.bio && <span className={styles['error-text']}>{errors.bio.message}</span>}
          </div>

          <Button type="submit" className={styles.create} size="large" variant="contained">
            Save
          </Button>
        </form>
      </Paper>
    </div>
  );
}
