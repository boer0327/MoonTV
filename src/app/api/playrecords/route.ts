/* eslint-disable no-console */

import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';
import { PlayRecord } from '@/lib/types';

export const runtime = 'edge';

export async function GET() {
  try {
    const records = await db.getAllPlayRecords();
    return NextResponse.json(records, { status: 200 });
  } catch (err) {
    console.error('获取播放记录失败', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, record }: { key: string; record: PlayRecord } = body;

    if (!key || !record) {
      return NextResponse.json(
        { error: 'Missing key or record' },
        { status: 400 }
      );
    }

    // 验证播放记录数据
    if (!record.title || !record.source_name || record.index < 1) {
      return NextResponse.json(
        { error: 'Invalid record data' },
        { status: 400 }
      );
    }

    // In a real app, you'd get the user_id from the session
    const userId = 1; // Placeholder
    const recordWithUser = {
      ...record,
      user_id: userId,
      save_time: Date.now(),
    };

    // await db.savePlayRecord(source, id, recordWithUser);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('保存播放记录失败', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
