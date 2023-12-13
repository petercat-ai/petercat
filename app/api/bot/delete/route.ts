import { supabase } from '@/share/supabas-client';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required!' }, { status: 400 });
  }

  try {
    const { error } = await supabase.from('bots').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: error?.message }, { status: 400 });
    }

    return NextResponse.json({ id }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
