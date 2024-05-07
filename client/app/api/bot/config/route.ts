import { Tables } from '@/types/database.types';
import { NextResponse } from 'next/server';
import { supabase } from '@/share/supabas-client';
import { getSession } from '@auth0/nextjs-auth0/edge';

export const runtime = 'edge';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const session = await getSession();
  const uid = session!.user.sub;
  if (!id || !uid) {
    return NextResponse.json({ error: 'Auth failed' }, { status: 401 });
  }
  try {
    const res = await supabase
      .from('bots')
      .select('*')
      .eq('id', id)
      .eq('uid', uid);
    if (res?.error) {
      return NextResponse.json({ error: res?.error?.message }, { status: 400 });
    }
    const bots = res?.data ?? ([] as Tables<'bots'>[]);
    return NextResponse.json({ data: bots }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};
