import { supabase } from '@/share/supabas-client';
import { AppRouteHandlerFnContext, Session, handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

export const GET = handleAuth({
  callback: async (req: NextRequest, ctx: AppRouteHandlerFnContext) => {
    return await handleCallback(req, ctx, {
      afterCallback: async (_req: NextRequest, session: Session) => {
        const user = session.user;
        await supabase.from('profiles').upsert(
          [{
            id: user.sub,
            nickname: user.nickname,
            name: user.name,
            picture: user.picture,
            sid: user.sid,
            sub: user.sub,
          }]
        );

        return session;
      }
    });
  }
});
