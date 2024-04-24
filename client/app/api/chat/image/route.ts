import OpenAI from 'openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export const GET = async (request: Request) => {
  const openai = new OpenAI();

  try {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get('prompt');
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt!,
      quality: 'standard',
      n: 1,
      size: '1024x1024',
    });

    const url = response.data?.[0].url;
    return NextResponse.json({ data: url }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
};
