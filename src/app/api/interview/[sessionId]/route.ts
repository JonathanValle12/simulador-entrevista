import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/session/store';
import { clearSessionCookie } from '@/lib/http/cookies';

export async function DELETE(_req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  deleteSession(sessionId);

  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res);

  return res;
}