import { supabase } from '@/share/supabas-client';
import { Tables } from '@/types/database.types';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const res = await supabase.from('bots').select('*');
    if (res?.error) {
      return NextResponse.json({ error: res?.error?.message }, { status: 400 });
    }
    const bots = res?.data ?? ([] as Tables<'bots'>[]);
    return NextResponse.json({ data: bots }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
};
