import { NextResponse } from 'next/server';
import { deleteSession } from '@/app/lib/sessions';

export async function DELETE( _req: Request, ctx: {params: Promise<{ sessionId: string}> }) {
    const { sessionId} = await ctx.params;

  deleteSession(sessionId);
  return NextResponse.json({ ok: true });
}