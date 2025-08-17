import { scoreSession } from "@/app/lib/ai/score";
import { getSession } from "@/app/lib/sessions";
import { InterviewResult } from "@/app/types/result";
import ResultClient from "./ResultClient";


export default async function Resultado({
    params,
}: { params: Promise<{ sessionId: string}>}) {
    const { sessionId } = await params;

    const s = getSession(sessionId);
  if (!s) return

  const data: InterviewResult = await scoreSession(s);

    return <ResultClient data={data} />
}