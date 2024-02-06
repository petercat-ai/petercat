import { supabase } from '@/share/supabas-client';
import { Tables } from '@/types/database.types';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export const GET = async (request: Request) => {
  const headers = request.headers;
  const uid = headers.get('x-bot-meta-uid');
  try {
    let res;
    if (!uid) {
      res = await supabase
        .from('bots')
        .select(
          'id, created_at, updated_at, avatar, description, enable_img_generation, label, name, starters, voice, public',
        )
        .eq('public', true)
        .order('created_at', { ascending: false });
    } else {
      res = await supabase
        .from('bots')
        .select(
          'id, created_at, updated_at avatar, description, enable_img_generation, label, name, starters, voice, public',
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
