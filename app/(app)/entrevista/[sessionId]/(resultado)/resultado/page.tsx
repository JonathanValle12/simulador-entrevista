// app/(app)/entrevista/[sessionId]/resultado/page.tsx
import { getSession } from "@/app/lib/sessions";
import ResultClient from "./ResultClient";
import Header from "./ui/Header";
import { redirect } from "next/navigation";
import type { SessionState } from "@/app/types/interview";
// opcional: si quieres calcular el score aquí en vez de esperar al cliente
// import { scoreSession } from "@/app/lib/ai/score";

export default async function Resultado({
  params,
}: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;

  const s: SessionState | undefined = getSession(sessionId);
  if (!s) redirect("/config");

  const completed = s.history.filter(h => h.skipped || h.answer !== undefined).length;
  const timeUp = Date.now() >= s.endsAt;
  const finishedByCount = completed >= s.planned;

  if (!timeUp && !finishedByCount) {
    redirect(`/entrevista/${sessionId}`);
  }

  return (
    <>
      <Header sessionId={sessionId} />
      <ResultClient sessionId={sessionId} initialData={s.result ?? null} />
    </>
  );
}
