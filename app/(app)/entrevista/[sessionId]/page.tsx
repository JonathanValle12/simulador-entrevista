import InterviewClient from "./InterviewClient";

export default async function Entrevista({
    params,
} : { params: Promise<{ sessionId: string}> }) {
    const {sessionId} = await params;

  return (
    <>
      <InterviewClient sessionId={sessionId} />
    </>
  )
}