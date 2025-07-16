import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send('Missing code');
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', process.env.NEXT_PUBLIC_VATSIM_CLIENT_ID!);
  params.append('client_secret', process.env.NEXT_PUBLIC_VATSIM_CLIENT_SECRET!);
  params.append('redirect_uri', process.env.NEXT_PUBLIC_VATSIM_REDIRECT_URI!);
  params.append('code', code);

  try {
    const tokenRes = await fetch('https://auth-dev.vatsim.net/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!tokenRes.ok) {
      const error = await tokenRes.text();
      return res.status(500).send('Token exchange failed: ' + error);
    }

    const tokenData = await tokenRes.json();
    return res.status(200).json(tokenData);
  } catch (err) {
    return res.status(500).send('OAuth error: ' + (err as Error).message);
  }
}
