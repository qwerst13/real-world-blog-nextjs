import { RegisterOptions } from 'react-hook-form';

export function emailValidationOptions(): RegisterOptions {
  return {
    required: 'This field is required',
    pattern: {
      value:
        // eslint-disable-next-line max-len
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Your email should be valid',
    },
  };
}

export function passwordValidationOptions(): RegisterOptions {
  return {
    required: 'This field is required',
    minLength: {
      value: 6,
      message: 'Password is too short',
    },
    maxLength: {
      value: 40,
      message: 'Whoa! No need for that long pass',
    },
  };
}

export function repeatPasswordValidationOptions(password: string, repeatPassword: string): RegisterOptions {
  return {
    required: 'This field is required',
    validate: () => password === repeatPassword || 'Passwords are different',
  };
}

export function usernameValidationOptions(): RegisterOptions {
  return {
    required: 'This field is required',
    minLength: {
      value: 3,
      message: 'Username is too short',
    },
    maxLength: {
      value: 20,
      message: 'You need to use not that long username',
    },
  };
}

export function acceptValidationOptions(): RegisterOptions {
  return {
    required: 'You need to accept rules to proceed',
  };
}

export function avatarUrlValidationOptions(): RegisterOptions {
  return {
    pattern: {
      value: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      message: 'Should be valid url with protocol',
    },
  };
}
