import { getSession } from "@/lib/session/store";
import ResultClient from "@/components/interview/result/ResultClient";
import Header from "@/components/interview/result/layout/Header";
import { redirect } from "next/navigation";
import { type SessionState } from "@/types/interview";
import { hasFinished } from "@/lib/session/logic";

export default async function Resultado({
  params,
}: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  const s: SessionState | undefined = getSession(sessionId);
  if (!s) redirect("/config");

  const { done } = hasFinished(s);

  if (!done) redirect(`/entrevista/${sessionId}`);

  return (
    <>
      <Header sessionId={sessionId} />
      <ResultClient sessionId={sessionId} initialData={s.result ?? null} />
    </>
  );
}
