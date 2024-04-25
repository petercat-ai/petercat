import { supabase } from '@/share/supabas-client';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

export const runtime = 'edge';

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const session = await getSession();
  const uid = session!.user.sub;
  if (!id || !uid) {
    return NextResponse.json({ error: 'Auth failed' }, { status: 401 });
  }

  try {
    const uid = session!.user.sub;
    const { error } = await supabase
      .from('bots')
      .delete()
      .eq('id', id)
      .eq('uid', uid);

    if (error) {
      return NextResponse.json({ error: error?.message }, { status: 400 });
    }

    return NextResponse.json({ id }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
