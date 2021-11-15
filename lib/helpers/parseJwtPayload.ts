interface JwtPayload {
  id: number;
  username: string;
  bio?: string | null;
  image?: string;
  iat: number;
  exp: number;
}

export function parseJwtPayload(token: string | null): JwtPayload | undefined {
  if (!token) return undefined;

  let jsonPayload;

  try {
    const [, base64Url] = token.split('.');
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (_) {
          return '%' + ('00' + _.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  } catch (err) {
    return undefined;
  }

  return JSON.parse(jsonPayload);
}
