import { supabase } from '@/share/supabas-client';
import { omit } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body?.id;
    const params = omit(body, 'id');
    if (!id) {
      return NextResponse.json({ error: 'id is required!' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('bots')
      .update(params)
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error?.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
