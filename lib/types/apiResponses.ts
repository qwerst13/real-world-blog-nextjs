export interface Error {
  errors: {
    body: string[];
  };
}

export interface User {
  username: string;
  email: string;
  password: string;
  token: string;
  bio: string | null;
  image: string | null;
  following: true;
}

interface Profile {
  username: string;
  bio: string;
  image: string;
  following: true;
}

export interface Tags {
  tags: string[];
}

export type DataToLogin = Pick<User, 'email' | 'password'>;

export interface ResponseToLogin {
  user: DataToLogin;
}

export type UserData = Pick<User, 'email' | 'token' | 'username' | 'bio' | 'image'>;

export interface UserInfo {
  user: UserData;
}

export interface Login extends UserInfo {}

export type DataToRegistration = Pick<User, 'username' | 'email' | 'password'>;

export interface ResponseToRegistration {
  user: DataToRegistration;
}

export interface Registration extends UserInfo {}

export interface UpdateUser extends UserInfo {}

export interface ProfileInfo {
  profile: Profile;
}

export interface FollowUser extends ProfileInfo {}

export interface UnfollowUser extends ProfileInfo {}

export interface SingleArticle {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}

export interface AllArticles {
  articles: SingleArticle[];
  articlesCount: number;
}

export interface FollowedArticles extends AllArticles {}

export type FormData = Pick<SingleArticle, 'title' | 'description' | 'body' | 'tagList'>;

export interface ArticleToCreate {
  article: FormData;
}

export interface GetArticle {
  article: SingleArticle;
}

export interface CreateArticle extends GetArticle {}

export type ArticleDataToUpdate = Pick<SingleArticle, 'title' | 'description' | 'body'>;

export interface ArticleToUpdate {
  article: ArticleDataToUpdate;
}

export interface UpdateArticle extends GetArticle {}

export interface Comment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Profile;
}

export interface GetComment {
  comment: Comment;
}

export interface Comments {
  comments: Comment[];
}

export interface CommentToCreate {
  comment: Pick<Comment, 'body'>;
}

export interface Favorites extends GetArticle {}
