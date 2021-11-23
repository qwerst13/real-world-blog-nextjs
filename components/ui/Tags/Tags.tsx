import styles from './Tags.module.scss';

interface TagsProps {
  tagList: string[];
}

export function Tags({ tagList }: TagsProps) {
  const tags = tagList.map((tag) => (
    <div key={tag} className={styles.tag}>
      {tag}
    </div>
  ));

  return <div className={styles.tags}>{tags}</div>;
}
