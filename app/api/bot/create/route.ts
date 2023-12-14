import { supabase } from '@/share/supabas-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { data, error } = await supabase.from('bots').insert([body]).select();
    if (error) {
      return NextResponse.json({ error: error?.message }, { status: 400 });
    }

    return NextResponse.json({ data: data?.[0] }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
