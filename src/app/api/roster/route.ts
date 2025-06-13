import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://api.zlcartcc.org/v1/user/roster');
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch roster' }, { status: 500 });
  }
  const data = await res.json();
  return NextResponse.json(data);
}
