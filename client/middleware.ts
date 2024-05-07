import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@auth0/nextjs-auth0/edge'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const session = await getSession();
  
  if (!session?.user) {
    return NextResponse.redirect(new URL('/api/auth/login', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/factory/:path*',
  ],
}
