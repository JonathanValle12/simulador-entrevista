import { getSession } from "@/app/lib/sessions";
import ResultClient from "./ResultClient";
import Header from "./ui/Header";


export default async function Resultado({
    params,
}: { params: Promise<{ sessionId: string }> }) {
    const { sessionId } = await params;
    const s = getSession(sessionId);

    return (
        <>
            <Header sessionId={sessionId} />
            <ResultClient sessionId={sessionId} initialData={s?.result ?? null} />
        </>
    )
}