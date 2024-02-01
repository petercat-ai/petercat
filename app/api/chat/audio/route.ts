import OpenAI from 'openai';
import { supabase } from '@/share/supabas-client';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const openai = new OpenAI();

  try {
    const body = await req.json();
    const response = await openai.audio.speech.create({
      model: 'tts-1',
      voice: body?.voice,
      input: body?.input,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer) {
      return NextResponse.json({ error: 'Generate error' }, { status: 400 });
    }
    const fileName = `${Date.now()}.mp3`;

    const { data, error } = await supabase.storage
      .from('bot-audio')
      .upload(fileName, buffer, {
        contentType: 'audio/mpeg',
      });
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json(
      {
        ...data,
        realPath: `${process.env.SUPABASE_URL}/storage/v1/object/public/bot-audio/${data?.path}`,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
