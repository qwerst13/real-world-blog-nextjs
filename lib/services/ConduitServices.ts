import * as Types from '../types/apiResponses';
import { hashPassword } from '../helpers/auth';

type ReqType = 'GET' | 'POST' | 'PUT' | 'DELETE';

export default class ConduitServices {
  private host = process.env.API_URL;

  private getStorageItem(key: string): string | null {
    return window.sessionStorage.getItem(key);
  }

  private requestOptions<T>(method: ReqType, isAuth: boolean, body?: T) {
    if (isAuth) {
    }
    if (!body) {
      return {
        method,
      };
    }
  }

  async login(email: string, password: string): Promise<Types.Login | Types.Error> {
    const hashedPassword = await hashPassword(password);

    const data: Types.DataToLogin = {
      user: { email, password: hashedPassword },
    };

    const response = await fetch(`${this.host}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.json();
  }
}
