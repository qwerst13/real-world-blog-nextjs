import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import classNames from 'classnames/bind';
import { Paper } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { ConduitServices } from '../../lib/services/ConduitServices';
import { SingleArticle } from '../../lib/types/apiResponses';
import { Input } from '../Input';
import { TagList } from '../TagList';

import styles from '../../styles/Form.module.scss';
import { Tags } from '../Tags';

let cn = classNames.bind(styles);
const api = new ConduitServices();

interface ArticleFormProps {
  articleData?: SingleArticle;
}

interface FormData {
  title: string;
  description: string;
  body: string;
  tagList: { tag: string }[];
}

export function ArticleForm({ articleData }: ArticleFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const defaultValues = articleData
    ? { title: articleData.title, description: articleData.description, body: articleData.body }
    : { tagList: [{ tag: '' }] };
  const {
    register,
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<FormData>({ defaultValues });
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
      router.push('/');
    }
  };

  const updateArticle: SubmitHandler<FormData> = async ({ title, description, body }) => {
    setIsLoading(true);
    const data = await api.updateArticle(articleData!.slug, { title, description, body });

    // TODO при ответе с сервера со статусом 200, но с ключом объекта errors: ['описание ошибки'] сделать соответствующий вывод
    if ('errors' in data) {
      const message = data.errors;
      console.log(message);
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    setFocus('title');
  }, [setFocus]);

  return (
    <div className={styles.container}>
      <Paper className={cn('paper', 'article')} elevation={2}>
        <h3 className={styles.title}>{articleData ? 'Edit article' : 'Create new article'}</h3>

        <form onSubmit={articleData ? handleSubmit(updateArticle) : handleSubmit(createArticle)}>
          <Input
            type="text"
            name="title"
            label="Title"
            placeholder="Title"
            error={errors.title}
            register={register}
            validationOptions={{ required: "Title can't be empty" }}
          />

          <Input
            type="text"
            name="description"
            label="Description"
            placeholder="Description"
            error={errors.description}
            register={register}
            validationOptions={{ required: 'Enter a description' }}
          />

          <Input
            type="textarea"
            rows={10}
            name="body"
            label="Text"
            placeholder="Enter a text in markdown format"
            error={errors.body}
            register={register}
            validationOptions={{ required: 'Enter a text' }}
          />

          {articleData ? <Tags tagList={articleData.tagList} /> : <TagList fields={fields} register={register} prepend={prepend} remove={remove} />}

          <LoadingButton loading={isLoading} type="submit" className={cn('create', 'send')} size="large" variant="contained">
            Send
          </LoadingButton>
        </form>
      </Paper>
    </div>
  );
}
