import * as Types from '../types/apiResponses';
import { DataToLogin, DataToRegistration } from '../types/apiResponses';
import { getStorageItem } from '../helpers/localStorage';

type ReqType = 'GET' | 'POST' | 'PUT' | 'DELETE';

class CustomError extends Error {
  constructor(readonly message: string, readonly status: number) {
    super(message);
    this.status = status;
  }
}

export class ConduitServices {
  private host = process.env.NEXT_PUBLIC_API_URL as string;
  private storageKey = process.env.NEXT_PUBLIC_STORAGE_KEY as string;

  private requestOptions<T>(method: ReqType, body?: T) {
    let token: string | undefined;

    if (typeof window !== 'undefined') {
      token = getStorageItem(this.storageKey) ? JSON.parse(getStorageItem(this.storageKey) as string).token : undefined;
    } else {
      token = undefined;
    }

    const headers: any = token
      ? {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        }
      : {
          'Content-Type': 'application/json',
        };

    if (!body) {
      return { method, headers };
    } else return { method, headers, body: JSON.stringify(body) };
  }

  private async request<T, U = any>(url: string, method: ReqType = 'GET', data?: U): Promise<T | Types.Error> {
    let response: Response | undefined;

    try {
      if (method === 'GET') {
        response = await fetch(url, this.requestOptions(method));
      }

      if (method === 'POST') {
        response = await fetch(url, this.requestOptions<U>(method, data));
      }

      if (method === 'PUT') {
        response = await fetch(url, this.requestOptions<U>(method, data));
      }

      if (method === 'DELETE') {
        response = await fetch(url, this.requestOptions(method));
      }

      return await response!.json();
    } catch (e: any) {
      throw new CustomError(e.message, response!.status);
    }
  }

  // User requests

  async login(dataToLogin: DataToLogin) {
    const data = {
      user: { ...dataToLogin },
    };

    return this.request<Types.Login, typeof data>(`${this.host}/users/login`, 'POST', data);
  }

  async register(dataToRegistration: DataToRegistration): Promise<Types.Registration | Types.Error> {
    const data = {
      user: { ...dataToRegistration },
    };

    return this.request<Types.Registration, typeof data>(`${this.host}/users`, 'POST', data);
  }

  async getCurrentUser(): Promise<Types.UserInfo | Types.Error> {
    return this.request(`${this.host}/user`);
  }

  async updateCurrentUser(dataObj: Partial<Types.UserData>) {
    const data = {
      user: dataObj,
    };

    return this.request<Types.UpdateUser>(`${this.host}/user`, 'PUT', data);
  }

  // Profile requests

  async getProfile(username: string): Promise<Types.ProfileInfo | Types.Error> {
    return this.request(`${this.host}/profiles/${username}`);
  }

  async followUser(username: string): Promise<Types.ProfileInfo | Types.Error> {
    return this.request<Types.ProfileInfo>(`${this.host}/profiles/${username}/follow`, 'POST');
  }

  async unfollowUser(username: string): Promise<Types.ProfileInfo | Types.Error> {
    return this.request<Types.ProfileInfo>(`${this.host}/profiles/${username}/follow`, 'DELETE');
  }

  // Articles requests

  async getAllArticles(limit: number = 20, offset: number = 0): Promise<Types.AllArticles | Types.Error> {
    const queryString = `?limit=${limit}&offset=${offset}`;

    return this.request(`${this.host}/articles${queryString}`);
  }

  async getFollowedArticles(qty: number = 20, page: number = 0): Promise<Types.AllArticles | Types.Error> {
    const queryString = `?limit=${qty}&offset=${page * qty}`;

    return this.request(`${this.host}/articles/feed${queryString}`);
  }

  async createArticle(articleData: Pick<Types.SingleArticle, 'title' | 'description' | 'body' | 'tagList'>) {
    const data: Types.ArticleToCreate = { article: articleData };

    return this.request<Types.GetArticle, typeof data>(`${this.host}/articles`, 'POST', data);
  }

  async getArticle(slug: string) {
    return this.request<Types.GetArticle>(`${this.host}/articles/${slug}`);
  }

  async updateArticle(slug: string, articleData: Partial<Pick<Types.SingleArticle, 'title' | 'description' | 'body' | 'tagList'>>) {
    const data = { article: articleData };

    return this.request<Types.GetArticle, typeof data>(`${this.host}/articles/${slug}`, 'PUT', data);
  }

  async deleteArticle(slug: string) {
    return this.request<boolean>(`${this.host}/articles/${slug}`, 'DELETE');
  }

  // Comments requests

  async getCommentsForArticle(slug: string): Promise<Types.Comments | Types.Error> {
    return this.request(`${this.host}/articles/${slug}/comments`);
  }

  async commentArticle(slug: string, comment: string) {
    const body = {
      comment: {
        body: comment,
      },
    };

    return this.request<Types.GetComment, typeof body>(`${this.host}/articles/${slug}/comments`, 'POST', body);
  }

  async deleteComment(slug: string, id: number) {
    return this.request<boolean>(`${this.host}/articles/${slug}/comments/${id}`, 'DELETE');
  }

  async favoriteArticle(slug: string) {
    return this.request<Types.GetArticle, string>(`${this.host}/articles/${slug}/favorite`, 'POST');
  }

  async unfavoriteArticle(slug: string) {
    return this.request<Types.GetArticle>(`${this.host}/articles/${slug}/favorite`, 'DELETE');
  }

  // Tag request

  async getTags(): Promise<Types.Tags | Types.Error> {
    return this.request(`${this.host}/tags`);
  }
}
