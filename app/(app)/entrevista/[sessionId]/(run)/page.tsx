// app/(app)/entrevista/[sessionId]/page.tsx
import InterviewClient from "./InterviewClient";
import { getSession } from "@/app/lib/sessions";
import type { QA, SessionState } from "@/app/types/interview";

export default async function Entrevista({
  params,
}: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  const s: SessionState | undefined = getSession(sessionId) ?? undefined;
  const last = s?.history.at(-1);
  const initialQuestion: QA | null =
    last && !last.answer ? last : null;

  return (
    <InterviewClient
      sessionId={sessionId}
      initialState={s ?? null}
      initialQuestion={initialQuestion}
    />
  );
}