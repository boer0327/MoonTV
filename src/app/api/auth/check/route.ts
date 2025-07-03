import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export const runtime = 'edge';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-jwt-key');

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: '未认证' }, { status: 401 });
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: '认证失败' }, { status: 401 });
  }
}
