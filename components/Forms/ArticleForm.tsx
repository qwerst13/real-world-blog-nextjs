import { Button, Paper } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import classNames from 'classnames/bind';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { ArticleDataToCreate, ArticleDataToUpdate } from '../../lib/types/apiResponses';
import {} from '../../lib/helpers/validators';
import { TagList } from '../TagList';
import { Input } from '../Input';

import { useSession } from '../../lib/hooks/useSession';

import styles from './Form.module.scss';
import { useEffect } from 'react';

let cn = classNames.bind(styles);
const api = new ConduitServices();

interface ArticleFormProps {
  isNew: boolean;
  slug?: string;
}

export function ArticleForm({ isNew, slug }: ArticleFormProps) {
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleDataToCreate>();
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({ control, name: 'tagList' });

  const createArticle: SubmitHandler<ArticleDataToCreate> = async ({ title, description, body, tagList }) => {
    const data = await api.createArticle({ title, description, body, tagList });

    // TODO при ответе с сервера со статусом 200, но с ключом объекта errors: ['описание ошибки'] сделать соответствующий вывод
    if ('errors' in data) {
      const message = data.errors;
      console.log(message);
    } else {
      // TODO обработка ответа
    }
  };

  const updateArticle: SubmitHandler<ArticleDataToUpdate> = async ({ title, description, body }) => {
    const data = await api.updateArticle(slug!, { title, description, body });

    // TODO при ответе с сервера со статусом 200, но с ключом объекта errors: ['описание ошибки'] сделать соответствующий вывод
    if ('errors' in data) {
      const message = data.errors;
      console.log(message);
    } else {
      // TODO обработка ответа
    }
  };

  useEffect(() => {
    append(['1234']);
  }, []);

  return (
    <div className={styles.container}>
      <Paper className={styles.paper} elevation={2}>
        <h3 className={styles.title}>{isNew ? 'Create new article' : 'Edit article'}</h3>

        <form onSubmit={isNew ? handleSubmit(updateArticle) : handleSubmit(createArticle)}>
          <div className={cn({ field: true, article: true })}>
            <div className={styles.label}>
              <label htmlFor="title">Title</label>
            </div>
            <input
              type="text"
              placeholder="Title"
              className={cn({ input: true, red: errors.title })}
              {...register('title', { required: "Title can't be empty" })}
            />
            {errors.title && <span className={styles['error-text']}>{errors.title.message}</span>}
          </div>

          <div className={cn({ field: true, article: true })}>
            <div className={styles.label}>
              <label htmlFor="description">Description</label>
            </div>
            <input
              type="text"
              placeholder="Description"
              className={cn({ input: true, red: errors.description })}
              {...register('description', { required: 'Enter a description' })}
            />
            {errors.description && <span className={styles['error-text']}>{errors.description.message}</span>}
          </div>

          <div className={cn({ field: true, article: true })}>
            <div className={styles.label}>
              <label htmlFor="body">Text</label>
            </div>
            <textarea
              rows={10}
              placeholder="Enter a text in markdown format"
              className={cn({ area: true, red: errors.body })}
              {...register('body')}
            />
            {errors.body && <span className={styles['error-text']}>{errors.body.message}</span>}
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className={styles.field}>
              <input type="text" placeholder="Tag" className={cn({ input: true })} {...register(`tagList.${index}.tag` as const)} />
              <Button className={cn({ button: true, add: true })} variant="outlined" onClick={() => append(index)}>
                Add Tag
              </Button>
              <Button className={cn({ button: true, delete: true })} variant="outlined" onClick={() => remove(index)}>
                Delete
              </Button>
            </div>
          ))}

          <Button type="submit" className={styles.create} size="large" variant="contained">
            Send
          </Button>
        </form>
      </Paper>
    </div>
  );
}
