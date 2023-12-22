import { supabase } from '@/share/supabas-client';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const session = await getSession();
  try {
    const body = await req.json();
    const { data, error } = await supabase.from('bots').insert([{ ...body, uid: session!.user.sub }]).select();
    if (error) {
      return NextResponse.json({ error: error?.message }, { status: 400 });
    }

    return NextResponse.json({ data: data?.[0] }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
