import { NextResponse } from 'next/server';
import { deleteSession } from '@/app/lib/sessions';

export async function DELETE( _req: Request, ctx: {params: Promise<{ sessionId: string}> }) {
    const { sessionId} = await ctx.params;

  deleteSession(sessionId);

  const res = NextResponse.json({ ok: true});

  res.cookies.set("interview_session", "", { path: "/", maxAge: 0});

  return res;
}