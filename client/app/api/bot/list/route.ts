import { supabase } from '@/share/supabas-client';
import { Tables } from '@/types/database.types';
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

export const runtime = 'edge';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const personal = searchParams.get('personal');

  try {
    let res;
    if (personal !== 'true') {
      res = await supabase
        .from('bots')
        .select(
          'id, created_at, updated_at, avatar, description, enable_img_generation, label, name, starters, voice, public',
        )
        .eq('public', true)
        .order('created_at', { ascending: false });
    } else {
      const session = await getSession();
      const uid = session!.user.sub;
      res = await supabase
        .from('bots')
        .select(
          'id, created_at, updated_at, avatar, description, enable_img_generation, label, name, starters, voice, public',
        )
        .eq('uid', uid)
        .order('created_at', { ascending: false });
    }
    if (res?.error) {
      return NextResponse.json({ error: res?.error?.message }, { status: 400 });
    }
    const bots = res?.data ?? ([] as Tables<'bots'>[]);
    return NextResponse.json({ data: bots }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};
