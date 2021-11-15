import { Button, Paper } from '@mui/material';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import classNames from 'classnames/bind';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { ArticleDataToCreate, ArticleDataToUpdate } from '../../lib/types/apiResponses';
import {} from '../../lib/helpers/validators';

import styles from './Form.module.scss';
import { useSession } from '../../lib/hooks/useSession';
import { useRouter } from 'next/router';

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
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleDataToCreate>();

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

          <Button type="submit" className={styles.create} size="large" variant="contained">
            Send
          </Button>
        </form>
      </Paper>
    </div>
  );
}
