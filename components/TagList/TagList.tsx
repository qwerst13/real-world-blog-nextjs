import { FieldArrayWithId, FieldValues, UseFormRegister, FieldArray, FieldArrayMethodProps } from 'react-hook-form';
import classnames from 'classnames/bind';
import { Button } from '@mui/material';

import styles from '../../styles/Form.module.scss';

const cn = classnames.bind(styles);

interface TagListProps {
  fields: FieldArrayWithId<FieldValues, string, 'id'>[];
  register: UseFormRegister<any>;
  prepend: (value: Partial<FieldArray<FieldValues, string>> | Partial<FieldArray<FieldValues, string>>[], options?: FieldArrayMethodProps) => void;
  remove: (index?: number | number[]) => void;
}

export function TagList({ fields, register, prepend, remove }: TagListProps) {
  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id} className={cn('field', 'tags')}>
          <input type="text" placeholder="Tag" className={cn('input', 'input-tag')} {...register(`tagList.${index}.tag` as const)} />
          {!index && (
            <Button className={cn('button', 'add')} variant="outlined" onClick={() => prepend({ tag: '' })}>
              Add Tag
            </Button>
          )}
          <Button className={cn('button', 'delete')} variant="outlined" onClick={() => remove(index)}>
            Delete
          </Button>
        </div>
      ))}
    </>
  );
}
