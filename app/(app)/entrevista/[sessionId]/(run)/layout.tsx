// app/(app)/entrevista/[sessionId]/layout.tsx
import Header from "./ui/Header";
import { HUDProvider } from "./hud";
import { getSession } from "@/app/lib/sessions";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ sessionId: string }>;
};

export default async function Layout({ children, params }: LayoutProps) {
  const { sessionId } = await params;
  const s = getSession(sessionId);

  let initial = { total: 0, answered: 0, elapsedSec: 0, remainingSec: 0, paused: false };

  if (s) {
    const now = Date.now();
    const answered = s.history.filter(h => !!h.answer).length;
    const plannedMs = s.config.duracion * 60_000;
    const totalPausedMs = Math.max(0, s.endsAt - (s.startedAt + plannedMs));
    const baseNow = s.pausedAt ?? now;

    const elapsedSec = Math.max(0, Math.floor((baseNow - s.startedAt - totalPausedMs) / 1000));
    const remainingSec = Math.max(0, Math.floor((s.startedAt + plannedMs + totalPausedMs - baseNow) / 1000));

    initial = {total: s.planned, answered, elapsedSec, remainingSec, paused: !!s.pausedAt };
  }

  return (
    <HUDProvider initial={initial}>
      <Header />
      <main>{children}</main>
    </HUDProvider>
  );
}