import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export const POST = async (req: NextRequest) => {
  const openai = new OpenAI();

  try {
    const body = await req.json();
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: body.prompt,
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
