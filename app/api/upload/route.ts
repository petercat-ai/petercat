import { supabase } from '@/share/supabas-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = req.headers.get('content-type');

    if (!buffer) {
      return NextResponse.json(
        { error: 'No files received.' },
        { status: 400 },
      );
    }
    const fileName = `upload_${Date.now()}.jpg`;

    const { data, error } = await supabase.storage
      .from('bot-avatars')
      .upload(fileName, arrayBuffer, {
        contentType: contentType || 'image/jpeg',
      });
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(
      {
        data: {
          ...data,
          realPath: `${process.env.SUPABASE_URL}/v1/object/public/bot-avatars/${data?.path}`,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
