import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export const runtime = 'edge';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-jwt-key');

export async function POST(req: NextRequest) {
  try {
    const result = process.env.PASSWORD;

    if (!result) {
      return NextResponse.json({ ok: true });
    }

    const { password } = await req.json();
    if (typeof password !== 'string') {
      return NextResponse.json({ error: '密码不能为空' }, { status: 400 });
    }

    const matched = password === result;

    if (!matched) {
      return NextResponse.json(
        { ok: false, error: '密码错误' },
        { status: 401 }
      );
    }

    // Create JWT
    const token = await new SignJWT({ 'urn:example:claim': true })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(secret);

    const response = NextResponse.json({ ok: true });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.SECURE_COOKIE === 'true',
      sameSite: 'strict',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
