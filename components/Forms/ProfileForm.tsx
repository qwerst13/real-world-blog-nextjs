import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import classNames from 'classnames/bind';
import { Paper } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { UserData } from '../../lib/types/apiResponses';
import { usernameValidationOptions, emailValidationOptions, avatarUrlValidationOptions } from '../../lib/helpers/validators';
import { useSession } from '../../lib/hooks/useSession';
import { Input } from '../Input';
import { Dialog } from '../ui/Dialog';

import styles from '../../styles/Form.module.scss';

const cn = classNames.bind(styles);
const api = new ConduitServices();

interface FormData extends UserData {
  password: string;
}

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
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

    try {
      const data = await api.updateCurrentUser({ username, email, bio, image });

      if ('errors' in data) {
        setMessage(Object.entries(data.errors).join(' '));
        setIsLoading(false);
        setIsOpen(true);
      } else {
        updateUser(data.user);
        setMessage('Succesfully updated!');
        setIsLoading(false);
        setIsOpen(true);
      }
    } catch (e) {
      setMessage('Something went wrong. Check your Internet connection and try again.');
      setIsLoading(false);
      setIsOpen(true);
    }
  };

  function closeDialog() {
    setIsOpen(false);
  }

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

      <Dialog open={isOpen} onClose={closeDialog} title="Profile">
        {message}
      </Dialog>
    </div>
  );
}
