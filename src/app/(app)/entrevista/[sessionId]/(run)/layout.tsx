import Header from "@/components/interview/run/Header";
import { HUDProvider } from "@/components/interview/run/hud";
import { hudFromSession } from "@/lib/session-logic";
import { getSession } from "@/lib/sessions";

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ sessionId: string }>;
};

export default async function Layout({ children, params }: LayoutProps) {
  const { sessionId } = await params;
  const s = getSession(sessionId);

  const initial = s ? hudFromSession(s) : { total: 0, answered: 0, elapsedSec: 0, remainingSec: 0, paused: false};

  return (
    <HUDProvider initial={initial}>
      <Header />
      <main>{children}</main>
    </HUDProvider>
  );
}