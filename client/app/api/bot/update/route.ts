import { supabase } from '@/share/supabas-client';
import { omit } from 'lodash';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const session = await getSession();
  try {
    const uid = session!.user.sub;
    const body = await req.json();
    const id = body?.id;
    if (!id || !uid) {
      return NextResponse.json({ error: 'Auth failed' }, { status: 401 });
    }

    const params = omit(body, 'id');
    const { data, error } = await supabase
      .from('bots')
      .update(params)
      .eq('id', id)
      .eq('uid', uid)
      .select();

    if (error) {
      return NextResponse.json({ error: error?.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
