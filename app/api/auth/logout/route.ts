import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Logged out' });

  res.cookies.set('accessToken', '', { maxAge: 0, path: '/' });
  res.cookies.set('refreshToken', '', { maxAge: 0, path: '/' });

  return res;
}
