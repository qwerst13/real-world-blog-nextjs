import * as Types from '../types/apiResponses';
import { DataToLogin, DataToRegistration } from '../types/apiResponses';
import { getStorageItem } from '../helpers/localStorage';

type ReqType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export class ConduitServices {
  private host = process.env.NEXT_PUBLIC_API_URL as string;
  private storageKey = process.env.NEXT_PUBLIC_STORAGE_KEY as string;

  readonly unexpectedError: Types.Error = {
    errors: {
      body: ['Something went wrong'],
    },
  };

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

  async login(dataToLogin: DataToLogin): Promise<Types.Login | Types.Error> {
    try {
      const data = {
        user: { ...dataToLogin },
      };

      const response = await fetch(`${this.host}/users/login`, this.requestOptions<typeof data>('POST', data));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async register(dataToRegistration: DataToRegistration): Promise<Types.Registration | Types.Error> {
    try {
      const data = {
        user: { ...dataToRegistration },
      };

      const response = await fetch(`${this.host}/users`, this.requestOptions<typeof data>('POST', data));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async getCurrentUser(): Promise<Types.UserInfo | Types.Error> {
    try {
      const response = await fetch(`${this.host}/user`, this.requestOptions('GET'));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async updateCurrentUser(dataObj: Partial<Types.UserData>): Promise<Types.UpdateUser | Types.Error> {
    try {
      const data = {
        user: dataObj,
      };

      const response = await fetch(`${this.host}/user`, this.requestOptions<typeof data>('PUT', data));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async getProfile(username: string): Promise<Types.ProfileInfo | Types.Error> {
    try {
      const response = await fetch(`${this.host}/profiles/${username}`, this.requestOptions('GET'));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async followUser(username: string): Promise<Types.ProfileInfo | Types.Error> {
    try {
      const response = await fetch(`${this.host}/profiles/${username}/follow`, this.requestOptions('POST'));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async unfollowUser(username: string): Promise<Types.ProfileInfo | Types.Error> {
    try {
      const response = await fetch(`${this.host}/profiles/${username}/follow`, this.requestOptions('DELETE'));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async getAllArticles(limit: number = 20, offset: number = 0): Promise<Types.AllArticles | Types.Error> {
    const queryString = `?limit=${limit}&offset=${offset}`;

    try {
      const response = await fetch(`${this.host}/articles${queryString}`, this.requestOptions('GET'));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async getFollowedArticles(qty: number = 20, page: number = 0): Promise<Types.AllArticles | Types.Error> {
    const queryString = `?limit=${qty}&offset=${page * qty}`;

    try {
      const response = await fetch(`${this.host}/articles/feed${queryString}`, this.requestOptions('GET'));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async createArticle(articleData: Pick<Types.SingleArticle, 'title' | 'description' | 'body' | 'tagList'>): Promise<Types.GetArticle | Types.Error> {
    const data: Types.ArticleToCreate = { article: articleData };

    try {
      const response = await fetch(`${this.host}/articles`, this.requestOptions<typeof data>('POST', data));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async getArticle(slug: string): Promise<Types.GetArticle | Types.Error> {
    try {
      const response = await fetch(`${this.host}/articles/${slug}`, this.requestOptions('GET'));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async updateArticle(
    slug: string,
    articleData: Partial<Pick<Types.SingleArticle, 'title' | 'description' | 'body' | 'tagList'>>
  ): Promise<Types.GetArticle | Types.Error> {
    const data = { article: articleData };

    try {
      const response = await fetch(`${this.host}/articles/${slug}`, this.requestOptions<typeof data>('PUT', data));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async deleteArticle(slug: string): Promise<boolean | Types.Error> {
    try {
      const response = await fetch(`${this.host}/articles/${slug}`, this.requestOptions('DELETE'));

      if (response.status === 422) return response.json();
      return response.ok;
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async getCommentsForArticle(slug: string): Promise<Types.Comments | Types.Error> {
    try {
      const response = await fetch(`${this.host}/articles/${slug}/comments`, this.requestOptions('GET'));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async commentArticle(slug: string, comment: string): Promise<Types.GetComment | Types.Error> {
    const body = {
      comment: {
        body: comment,
      },
    };

    try {
      const response = await fetch(`${this.host}/articles/${slug}/comments`, this.requestOptions('POST', body));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async deleteComment(slug: string, id: number): Promise<boolean | Types.Error> {
    try {
      const response = await fetch(`${this.host}/articles/${slug}/comments/${id}`, this.requestOptions('DELETE'));

      if (response.status === 422) return response.json();
      return response.ok;
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async favoriteArticle(slug: string): Promise<Types.GetArticle | Types.Error> {
    try {
      const response = await fetch(`${this.host}/articles/${slug}/favorite`, this.requestOptions('POST'));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async unfavoriteArticle(slug: string): Promise<Types.GetArticle | Types.Error> {
    try {
      const response = await fetch(`${this.host}/articles/${slug}/favorite`, this.requestOptions('DELETE'));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }

  async getTags(): Promise<Types.Tags | Types.Error> {
    try {
      const response = await fetch(`${this.host}/tags`, this.requestOptions('GET'));

      return response.json();
    } catch (e) {
      return this.unexpectedError;
    }
  }
}
