import { NextResponse } from "next/server";
import { getSession, pushQuestion, answerCurrent, skipCurrent, updateLastQuestion } from "@/lib/session/store";
import { generateQuestion } from "@/lib/ai/generate";
import { determineEffectiveStack, allowedSetForRole, tokensInTextStrict } from "@/lib/ai/prompts/run";
import { hasFinished } from "@/lib/session/logic";

export async function POST(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const s = getSession(sessionId);

  if (!s) return NextResponse.json({ error: "not-found" }, { status: 404 });
  if (s.pausedAt) return NextResponse.json({ error: "paused" }, { status: 423 });

  const body = await req.json().catch(() => ({}));
  const userAnswer = (body?.answer as string | undefined)?.trim();
  const wantsSkip = !!body?.skip;

  const last = s.history.at(-1);
  const historyLenBefore = s.history.length;
  const hadStackBefore = determineEffectiveStack(s.config, s.history).length > 0;

  // Helper: ¿estamos en Q1 activa?
  const isQ1Active = historyLenBefore === 1 && last && !last.answer && !hadStackBefore;

  // Helper: ¿estamos en el gate de stack activo? (Q2 "gate")
  const isGateActive = historyLenBefore >= 2 && last && !last.answer && !hadStackBefore;

  // Si hay pregunta activa y no llega ni respuesta ni skip → devolvemos la actual
  if (!wantsSkip && !userAnswer && last && !last.answer) {
    const canSkip = !(isQ1Active || isGateActive);
    return NextResponse.json({ next: last, canSkip });
  }

  // --- Gestión de SKIP ---
  if (wantsSkip && last && !last.answer) {
    if (isQ1Active || isGateActive) {
      const canSkip = false;
      return NextResponse.json({ next: last, canSkip });
    }
    skipCurrent(s.id);
  }

  // --- VALIDACIÓN ESPECIAL PARA Q2 (GATE) ---
  if (historyLenBefore === 2 && userAnswer && !hadStackBefore) {
    // El usuario está respondiendo Q2 (gate de stack)
    // Validar que mencionó tecnologías válidas para el rol
    const allowed = allowedSetForRole(s.config.role);
    const mentionedTechs = tokensInTextStrict(userAnswer, [...allowed]);

    // RECHAZA si no mencióno al menos 1 tecnologia válida para el rol
    if (mentionedTechs.length === 0) {
      // NO guardar la respuesta, solo repetir la pregunta
      console.log("[next] ❌ GATE VALIDATION FAILED: No valid technologies mentioned for role", s.config.role);
      console.log("[next] Role allowed techs:", [...allowed].slice(0, 15).join(", "));

      // FLAG: Indica que la pregunta fue rechazada y regenerada
      const canSkip = false;
      // Devolver la misma pregunta sin guardar respuesta
      return NextResponse.json({
        next: last,
        canSkip,
        error: "invalid-stack",
        isRegenerated: true
      });
    }

    console.log("[next] ✅ GATE VALIDATION PASSED: Valid technologies detected:", mentionedTechs);

    // ✅ Mencionó tecnologías válidas, guardar respuesta
    answerCurrent(s.id, userAnswer);
  } else if (userAnswer) {
    // Respuestas normales (Q1, Q3+, etc)
    answerCurrent(s.id, userAnswer);
  }

  // Sesión actualizada
  const updated = getSession(sessionId)!;

  // ¿Ha terminado?
  const finishedState = hasFinished(updated);
  if (finishedState.done) {
    return NextResponse.json(finishedState);
  }

  // ¿Tenemos stack después de esta interacción?
  const hasStackAfter = determineEffectiveStack(updated.config, updated.history).length > 0;

  // Si acabamos de "conseguir" un stack válido, persístelo en config
  if (!hadStackBefore && hasStackAfter) {
    const eff = determineEffectiveStack(updated.config, updated.history);
    updated.config.stack = eff;
    console.log("[next] Stack configured:", eff);
  }

  // --- Ramas de flujo ---

  // 1) Tras responder Q1 (historial tenía 1) y ANTES no había stack:
  //    - Si sigue sin stack → empujamos Q2 gate (canSkip=false).
  //    - Si ya hay stack → empujamos Q2 real (canSkip=true).
  if (historyLenBefore === 1 && !hadStackBefore) {
    const ai = await generateQuestion(updated.config, updated.history, updated.planned);
    pushQuestion(s.id, ai);
    const canSkip = hasStackAfter;
    console.log("[next] Branch 1: After Q1, pushing Q2 (gate or real). canSkip:", canSkip);
    return NextResponse.json({ next: ai, canSkip, preface: ai.preface });
  }

  // 2) Estábamos en el gate (historial ≥ 2) y ANTES no había stack:
  //    - Si aún no hay stack → re-pregunta el gate (updateLastQuestion) (canSkip=false)
  //    - Si ya hay stack → reemplaza gate por Q2 real (updateLastQuestion) (canSkip=true)
  if (historyLenBefore >= 2 && !hadStackBefore && hasStackAfter) {
    const ai = await generateQuestion(updated.config, updated.history, updated.planned);
    updateLastQuestion(s.id, ai);
    const canSkip = hasStackAfter;
    console.log("[next] Branch 2: In gate, re-generating. canSkip:", canSkip);
    return NextResponse.json({ next: ai, canSkip, preface: ai.preface });
  }

  // 3) Flujo normal (ya teníamos stack antes): cada respuesta/skip empuja la siguiente pregunta
  {
    const ai = await generateQuestion(updated.config, updated.history, updated.planned);
    pushQuestion(s.id, ai);
    return NextResponse.json({ next: ai, canSkip: true, preface: ai.preface });
  }
}