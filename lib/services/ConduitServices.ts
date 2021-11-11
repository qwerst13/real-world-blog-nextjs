import * as Types from '../types/apiResponses';
import { DataToRegistration, ProfileInfo, SingleArticle } from '../types/apiResponses';

type ReqType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class ConduitServices {
  // TODO поменять на переменную окружения
  private host = process.env.NEXT_PUBLIC_API_URL;
  private storageKey = 'jwt';

  static getStorageItem(key: string): string | null {
    return window.localStorage.getItem(key);
  }

  private requestOptions<T>(method: ReqType, isAuth: boolean, body?: T) {
    const headers: any = isAuth
      ? {
          'Content-Type': 'application/json',
          Authorization: `Token ${ConduitServices.getStorageItem(this.storageKey)}`,
        }
      : {
          'Content-Type': 'application/json',
        };

    if (!body) {
      return { method, headers };
    } else return { method, headers, body: JSON.stringify(body) };
  }

  async login(email: string, password: string): Promise<Types.Login | Types.Error> {
    const data = {
      user: { email, password },
    };

    const response = await fetch(`${this.host}/users/login`, this.requestOptions<Types.DataToLogin>('POST', false, data));

    return response.json();
  }

  async register(username: string, email: string, password: string): Promise<Types.Registration | Types.Error> {
    const data = {
      user: { username, email, password },
    };

    const response = await fetch(`${this.host}/users`, this.requestOptions<Types.DataToRegistration>('POST', false, data));

    return response.json();
  }

  async getCurrentUser(): Promise<Types.UserInfo | Types.Error> {
    const response = await fetch(`${this.host}/user`, this.requestOptions('GET', true));

    return response.json();
  }

  async updateCurrentUser(
    dataObj: Partial<Pick<Types.User, 'email' | 'token' | 'username' | 'bio' | 'image'>>
  ): Promise<Types.UpdateUser | Types.Error> {
    const data = {
      user: dataObj,
    };

    const response = await fetch(`${this.host}/user`, this.requestOptions<typeof data>('PUT', true, data));

    return response.json();
  }

  async getProfile(username: string): Promise<Types.ProfileInfo | Types.Error> {
    const response = await fetch(`${this.host}/profiles/${username}`, this.requestOptions('GET', false));

    return response.json();
  }

  async followUser(username: string): Promise<Types.ProfileInfo | Types.Error> {
    const response = await fetch(`${this.host}/profiles/${username}/follow`, this.requestOptions('POST', true));

    return response.json();
  }

  async unfollowUser(username: string): Promise<Types.ProfileInfo | Types.Error> {
    const response = await fetch(`${this.host}/profiles/${username}/follow`, this.requestOptions('DELETE', true));

    return response.json();
  }

  // TODO статьи созданные пользователем видны только при авторизации, это нужно учесть т.к. первый вход на сайт вызовет проблему
  // нужно что-то вроде еще одного переключателя isAuth='optional'
  async getAllArticles(qty: number = 20, page: number = 0): Promise<Types.AllArticles | Types.Error> {
    const queryString = `?limit=${qty}&offset=${page * qty}`;

    const response = await fetch(`${this.host}/articles${queryString}`, this.requestOptions('GET', true));

    return response.json();
  }

  async getFollowedArticles(qty: number = 20, page: number = 0): Promise<Types.AllArticles | Types.Error> {
    const queryString = `?limit=${qty}&offset=${page * qty}`;

    const response = await fetch(`${this.host}/articles/feed${queryString}`, this.requestOptions('GET', true));

    return response.json();
  }

  async createArticle(articleData: Pick<SingleArticle, 'title' | 'description' | 'body' | 'tagList'>): Promise<Types.GetArticle | Types.Error> {
    const data: Types.ArticleToCreate = { article: articleData };

    const response = await fetch(`${this.host}/articles`, this.requestOptions<typeof data>('POST', true, data));

    return response.json();
  }

  // TODO isAuth
  async getArticle(slug: string): Promise<Types.GetArticle | Types.Error> {
    const response = await fetch(`${this.host}/articles/${slug}`, this.requestOptions('POST', true));

    return response.json();
  }

  async updateArticle(
    slug: string,
    articleData: Partial<Pick<SingleArticle, 'title' | 'description' | 'body' | 'tagList'>>
  ): Promise<Types.GetArticle | Types.Error> {
    const data = { article: articleData };

    const response = await fetch(`${this.host}/articles/${slug}`, this.requestOptions<typeof data>('PUT', true, data));

    return response.json();
  }

  async deleteArticle(slug: string): Promise<boolean | Types.Error> {
    const response = await fetch(`${this.host}/articles/${slug}`, this.requestOptions('DELETE', true));

    if (response.status === 422) return response.json();
    return response.ok;
  }

  // TODO isAuth
  async getCommentsForArticle(slug: string): Promise<Types.Comments | Types.Error> {
    const response = await fetch(`${this.host}/articles/${slug}/comments`, this.requestOptions('GET', true));

    return response.json();
  }

  async commentArticle(slug: string, comment: string): Promise<Types.GetComment | Types.Error> {
    const body = {
      comment: {
        body: comment,
      },
    };

    const response = await fetch(`${this.host}/articles/${slug}/comments`, this.requestOptions('POST', true, body));

    return response.json();
  }

  async deleteComment(slug: string, id: number): Promise<boolean | Types.Error> {
    const response = await fetch(`${this.host}/articles/${slug}/comments/${id}`, this.requestOptions('DELETE', true));

    if (response.status === 422) return response.json();
    return response.ok;
  }

  async favoriteArticle(slug: string): Promise<Types.GetArticle | Types.Error> {
    const response = await fetch(`${this.host}/articles/${slug}/favorite`, this.requestOptions('POST', true));

    return response.json();
  }

  async unfavoriteArticle(slug: string): Promise<boolean | Types.Error> {
    const response = await fetch(`${this.host}/articles/${slug}/favorite`, this.requestOptions('DELETE', true));

    if (response.status === 422) return response.json();
    return response.ok;
  }

  async getTags(): Promise<Types.Tags | Types.Error> {
    const response = await fetch(`${this.host}/tags`, this.requestOptions('GET', false));

    return response.json();
  }
}
