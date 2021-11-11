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
  bio: string;
  image: string;
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

export interface DataToLogin {
  user: Pick<User, 'email' | 'password'>;
}

export interface UserInfo {
  user: Pick<User, 'email' | 'token' | 'username' | 'bio' | 'image'>;
}

export interface Login extends UserInfo {}

export interface DataToRegistration {
  user: Pick<User, 'username' | 'email' | 'password'>;
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

export interface ArticleToCreate {
  article: Pick<SingleArticle, 'title' | 'description' | 'body' | 'tagList'>;
}

export interface GetArticle {
  article: SingleArticle;
}

export interface CreateArticle extends GetArticle {}

export interface ArticleToUpdate {
  article: Pick<SingleArticle, 'title' | 'description' | 'body'>;
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
