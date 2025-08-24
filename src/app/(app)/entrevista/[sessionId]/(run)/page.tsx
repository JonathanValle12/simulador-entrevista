import InterviewClient from "@/components/interview/run/InterviewClient";
import { hasFinished } from "@/lib/session-logic";
import { getSession } from "@/lib/sessions";
import type { QA, SessionState } from "@/types/interview";
import { redirect } from "next/navigation";

export default async function Entrevista({
  params,
}: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  const s: SessionState | undefined = getSession(sessionId);
  if (!s) redirect("/config");

  const { done } = hasFinished(s);
  if (done) redirect(`/entrevista/${sessionId}/resultado`);

  const last = s.history.at(-1);
  const initialQuestion: QA | null = last && !last.answer ? last : null;

  return (
    <InterviewClient sessionId={sessionId} initialState={s ?? null} initialQuestion={initialQuestion} />
  );
}