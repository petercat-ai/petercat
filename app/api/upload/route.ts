import { supabase } from '@/share/supabas-client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('formData');
    const formData = await req.json();
    console.log('formData', formData);
    const file = formData.get('file');
    // console.log('file', file);
    if (!file) {
      return NextResponse.json(
        { error: 'No files received.' },
        { status: 400 },
      );
    }

    const filename = `${Date.now()}`;
    // console.log('console.log(filename);', filename);
    const { data, error } = await supabase.storage
      .from('bot-avatars')
      .upload(filename, file);
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// export const config = {
//   api: {
//     bodyParser: false, // Disallow body parsing, consume as stream
//   },
// };
