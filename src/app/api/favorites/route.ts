
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Favorite } from '@/lib/types';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    // Placeholder for getting favorites for the logged-in user
    return NextResponse.json([], { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, favorite }: { key: string; favorite: Favorite } = body;

    if (!key || !favorite) {
      return NextResponse.json(
        { error: 'Missing key or favorite' },
        { status: 400 }
      );
    }

    // In a real app, you'd get the user_id from the session
    const userId = 1; // Placeholder
    const favoriteWithUser = { ...favorite, user_id: userId };


    console.log('Saving favorite:', { key, favorite: favoriteWithUser });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Failed to save favorite', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (!key) {
            return NextResponse.json({ error: 'Missing key' }, { status: 400 });
        }

        // In a real app, you'd get the user_id from the session
        const userId = 1; // Placeholder

        console.log('Deleting favorite:', { key, userId });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error('Failed to delete favorite', err);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
