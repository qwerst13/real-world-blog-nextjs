import { useState } from 'react';
import { Button, Paper } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import classNames from 'classnames/bind';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { ArticleDataToUpdate } from '../../lib/types/apiResponses';
import {} from '../../lib/helpers/validators';

import { useSession } from '../../lib/hooks/useSession';

import styles from './Form.module.scss';
import { useEffect } from 'react';

let cn = classNames.bind(styles);
const api = new ConduitServices();

interface ArticleFormProps {
  isNew: boolean;
  slug?: string;
}

interface FormData {
  title: string;
  description: string;
  body: string;
  tagList: { tag: string }[];
}

export function ArticleForm({ isNew, slug }: ArticleFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { tagList: [{ tag: '' }] } });

  const { fields, prepend, remove } = useFieldArray({ name: 'tagList', control });

  const createArticle: SubmitHandler<FormData> = async ({ title, description, body, tagList }) => {
    setIsLoading(true);
    const tags = tagList.map((item) => (item.tag.trim() ? item.tag : undefined)).filter((item) => item) as string[];

    const data = await api.createArticle({ title, description, body, tagList: tags });

    // TODO при ответе с сервера со статусом 200, но с ключом объекта errors: ['описание ошибки'] сделать соответствующий вывод
    if ('errors' in data) {
      const message = data.errors;
      console.log(message);
    } else {
      // TODO обработка ответа
    }
  };

  const updateArticle: SubmitHandler<FormData> = async ({ title, description, body }) => {
    setIsLoading(true);
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
    setFocus('title');
  }, [setFocus]);

  return (
    <div className={styles.container}>
      <Paper className={styles.paper} elevation={2}>
        <h3 className={styles.title}>{isNew ? 'Create new article' : 'Edit article'}</h3>

        <form onSubmit={isNew ? handleSubmit(createArticle) : handleSubmit(updateArticle)}>
          <div className={cn('field', 'article')}>
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

          <div className={cn('field', 'article')}>
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

          <div className={cn('field', 'article')}>
            <div className={styles.label}>
              <label htmlFor="body">Text</label>
            </div>
            <textarea
              rows={10}
              placeholder="Enter a text in markdown format"
              className={cn({ area: true, red: errors.body })}
              {...register('body', { required: 'Enter a text' })}
            />
            {errors.body && <span className={styles['error-text']}>{errors.body.message}</span>}
          </div>

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

          <LoadingButton loading={isLoading} type="submit" className={cn('create', 'send')} size="large" variant="contained">
            Send
          </LoadingButton>
        </form>
      </Paper>
    </div>
  );
}
