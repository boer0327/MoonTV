
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { User } from '@/lib/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password }: User = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Missing username or password' },
        { status: 400 }
      );
    }

    // This is a placeholder for database logic
    // In a real application, you would check if the user already exists
    // and then create a new user in the database.
    console.log('New user signup:', { username, password });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Signup failed', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
