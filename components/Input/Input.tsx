import classnames from 'classnames/bind';
import { FieldError, UseFormRegister, RegisterOptions } from 'react-hook-form';

import styles from '../../styles/Form.module.scss';

const cn = classnames.bind(styles);

interface InputProps {
  type: 'text' | 'password' | 'email' | 'textarea';
  name: string;
  label: string;
  placeholder: string;
  rows?: number;
  error: FieldError | undefined;
  register: UseFormRegister<any>;
  validationOptions?: RegisterOptions<any, any>;
}

export function Input({ type, name, error, label, placeholder, register, validationOptions, rows }: InputProps) {
  let inputField;

  if (type === 'textarea') {
    inputField = <textarea rows={rows} placeholder={placeholder} className={cn({ area: true, red: error })} {...register(name, validationOptions)} />;
  } else {
    inputField = <input type={type} placeholder={placeholder} className={cn({ input: true, red: error })} {...register(name, validationOptions)} />;
  }

  return (
    <div className={cn('field')}>
      <div className={styles.label}>
        <label htmlFor={name}>{label}</label>
      </div>
      {inputField}
      {error && <span className={styles['error-text']}>{error.message}</span>}
    </div>
  );
}
