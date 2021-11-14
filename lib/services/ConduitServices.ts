import * as Types from '../types/apiResponses';
import { DataToLogin, DataToRegistration, User } from '../types/apiResponses';

type ReqType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class ConduitServices {
  private host = process.env.NEXT_PUBLIC_API_URL;
  private storageKey = 'jwt';

  static getStorageItem(key: string): string | null {
    return window.localStorage.getItem(key);
  }

  private requestOptions<T>(method: ReqType, body?: T) {
    const token = ConduitServices.getStorageItem(this.storageKey);
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

  async login(dataToLogin: DataToLogin): Promise<Types.Login | Types.Error> {
    const data = {
      user: { ...dataToLogin },
    };

    const response = await fetch(`${this.host}/users/login`, this.requestOptions<typeof data>('POST', data));

    return response.json();
  }

  async register(dataToRegistration: DataToRegistration): Promise<Types.Registration | Types.Error> {
    const data = {
      user: { ...dataToRegistration },
    };

    const response = await fetch(`${this.host}/users`, this.requestOptions<typeof data>('POST', data));

    return response.json();
  }

  async getCurrentUser(): Promise<Types.UserInfo | Types.Error> {
    const response = await fetch(`${this.host}/user`, this.requestOptions('GET'));

    return response.json();
  }

  async updateCurrentUser(
    dataObj: Partial<Pick<Types.User, 'email' | 'token' | 'username' | 'bio' | 'image'>>
  ): Promise<Types.UpdateUser | Types.Error> {
    const data = {
      user: dataObj,
    };

    const response = await fetch(`${this.host}/user`, this.requestOptions<typeof data>('PUT', data));

    return response.json();
  }

  async getProfile(username: string): Promise<Types.ProfileInfo | Types.Error> {
    const response = await fetch(`${this.host}/profiles/${username}`, this.requestOptions('GET'));

    return response.json();
  }

  async followUser(username: string): Promise<Types.ProfileInfo | Types.Error> {
    const response = await fetch(`${this.host}/profiles/${username}/follow`, this.requestOptions('POST'));

    return response.json();
  }

  async unfollowUser(username: string): Promise<Types.ProfileInfo | Types.Error> {
    const response = await fetch(`${this.host}/profiles/${username}/follow`, this.requestOptions('DELETE'));

    return response.json();
  }

  async getAllArticles(qty: number = 20, page: number = 0): Promise<Types.AllArticles | Types.Error> {
    const queryString = `?limit=${qty}&offset=${page * qty}`;

    const response = await fetch(`${this.host}/articles${queryString}`, this.requestOptions('GET'));

    return response.json();
  }

  async getFollowedArticles(qty: number = 20, page: number = 0): Promise<Types.AllArticles | Types.Error> {
    const queryString = `?limit=${qty}&offset=${page * qty}`;

    const response = await fetch(`${this.host}/articles/feed${queryString}`, this.requestOptions('GET'));

    return response.json();
  }

  async createArticle(articleData: Pick<Types.SingleArticle, 'title' | 'description' | 'body' | 'tagList'>): Promise<Types.GetArticle | Types.Error> {
    const data: Types.ArticleToCreate = { article: articleData };

    const response = await fetch(`${this.host}/articles`, this.requestOptions<typeof data>('POST', data));

    return response.json();
  }

  async getArticle(slug: string): Promise<Types.GetArticle | Types.Error> {
    const response = await fetch(`${this.host}/articles/${slug}`, this.requestOptions('POST'));

    return response.json();
  }

  async updateArticle(
    slug: string,
    articleData: Partial<Pick<Types.SingleArticle, 'title' | 'description' | 'body' | 'tagList'>>
  ): Promise<Types.GetArticle | Types.Error> {
    const data = { article: articleData };

    const response = await fetch(`${this.host}/articles/${slug}`, this.requestOptions<typeof data>('PUT', data));

    return response.json();
  }

  async deleteArticle(slug: string): Promise<boolean | Types.Error> {
    const response = await fetch(`${this.host}/articles/${slug}`, this.requestOptions('DELETE'));

    if (response.status === 422) return response.json();
    return response.ok;
  }

  async getCommentsForArticle(slug: string): Promise<Types.Comments | Types.Error> {
    const response = await fetch(`${this.host}/articles/${slug}/comments`, this.requestOptions('GET'));

    return response.json();
  }

  async commentArticle(slug: string, comment: string): Promise<Types.GetComment | Types.Error> {
    const body = {
      comment: {
        body: comment,
      },
    };

    const response = await fetch(`${this.host}/articles/${slug}/comments`, this.requestOptions('POST', body));

    return response.json();
  }

  async deleteComment(slug: string, id: number): Promise<boolean | Types.Error> {
    const response = await fetch(`${this.host}/articles/${slug}/comments/${id}`, this.requestOptions('DELETE'));

    if (response.status === 422) return response.json();
    return response.ok;
  }

  async favoriteArticle(slug: string): Promise<Types.GetArticle | Types.Error> {
    const response = await fetch(`${this.host}/articles/${slug}/favorite`, this.requestOptions('POST'));

    return response.json();
  }

  async unfavoriteArticle(slug: string): Promise<boolean | Types.Error> {
    const response = await fetch(`${this.host}/articles/${slug}/favorite`, this.requestOptions('DELETE'));

    if (response.status === 422) return response.json();
    return response.ok;
  }

  async getTags(): Promise<Types.Tags | Types.Error> {
    const response = await fetch(`${this.host}/tags`, this.requestOptions('GET'));

    return response.json();
  }
}
