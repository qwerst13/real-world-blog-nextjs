interface JwtPayload {
  email: string;
  username: string;
  bio: string | null;
  image: string;
  iat: number;
  exp: number;
}

export function parseJwtPayload(token: string): JwtPayload {
  const [, base64Url] = token.split('.');
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (_) {
        return '%' + ('00' + _.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}
