import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";
import type { SessionState } from "@/types/interview";
import Hero from "@/components/site/sections/Hero";
import Features from "@/components/site/sections/Features";
import HowItWorks from "@/components/site/sections/HowItWorks";

export default async function Home() {
  const c = await cookies();
  const id = c.get("interview_session")?.value;
  if (id) {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const proto = h.get("x-forwarded-proto") ?? "http";
    const base = `${proto}://${host}`;

    const r = await fetch(`${base}/api/interview/${id}/state`, { cache: "no-store" });
    if (r.ok) {
      const s: SessionState = await r.json();
      const completed = s.history.filter(q => q.skipped || q.answer !== undefined).length;
      const min = Math.min(3, s.planned);
      const finished = Date.now() >= s.endsAt || completed >= min;

      redirect(finished ? `/entrevista/${id}/resultado` : `/entrevista/${id}`);
    }
  }

  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
    </>
  )
}