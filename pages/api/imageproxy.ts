import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = decodeURIComponent(req.query.url as string);
  const result = await fetch(url);
  const body = await result.body;
  (body as any).pipe(res);
}
