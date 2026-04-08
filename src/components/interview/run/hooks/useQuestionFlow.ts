'use client';

import { useEffect, useRef, useState } from 'react';
import type { QA } from '@/types/interview';

type NextPayload = { answer?: string; skip?: true };

function isAbortError(e: unknown) {
    return e instanceof DOMException && e.name === 'AbortError';
}

type Options = {
    initialQuestion?: QA | null;
    onGuardStart: (withAutoBack?: boolean) => void;
    onGuardClear: () => void;
    onAutoBackStart: () => void;
};

// Espera a que la sesión exista (GET /state 2xx). Reintenta corto si hay 404.
async function waitForSessionReady(
    sessionId: string,
    signal: AbortSignal,
    timeoutMs = 4000,
    stepMs = 150
) {
    const deadline = Date.now() + timeoutMs;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const r = await fetch(`/api/interview/${sessionId}/state`, { cache: 'no-store', signal });
        if (r.ok) return;                     // sesión creada → listo
        if (r.status !== 404) throw new Error(`state failed: ${r.status}`);
        if (Date.now() > deadline) throw new Error('session-not-ready');
        await new Promise<void>(res => setTimeout(res, stepMs));
        if (signal.aborted) throw new DOMException('aborted', 'AbortError');
    }
}

export function useQuestionFlow(sessionId: string, opts: Options) {
    const { initialQuestion, onGuardStart, onGuardClear, onAutoBackStart } = opts;

    const [question, setQuestion] = useState<QA | null>(initialQuestion ?? null);
    const [preface, setPreface] = useState<string | null>(null);
    const [canSkip, setCanSkip] = useState(true);
    const [loadingNext, setLoadingNext] = useState(false);
    const [timedOut, setTimedOut] = useState(false);

    const lastPayloadRef = useRef<NextPayload | null>(null);
    const abortRef = useRef<AbortController | null>(null);
    const bootedRef = useRef(false);

    // --- bootstrap (una sola vez por sesión) ---
    useEffect(() => {
        if (bootedRef.current) {
            console.log('[useQuestionFlow] already booted, skipping');
            return;
        }
        bootedRef.current = true;

        const ctrl = new AbortController();
        abortRef.current = ctrl;
        let isMounted = true;
        let isCleanupCalled = false;

        const runBootstrap = async () => {
            try {
                console.log('[useQuestionFlow] inside try block');
                if (!initialQuestion) {
                    if (!isMounted || isCleanupCalled) return;
                    setLoadingNext(true);
                    setQuestion(null);
                    setPreface(null);
                    onGuardStart(false);
                }

                console.log('[useQuestionFlow] calling /next...');
                console.log('[useQuestionFlow] sessionId:', sessionId);
                const res = await fetch(`/api/interview/${sessionId}/next`, {
                    method: 'POST',
                    signal: ctrl.signal,
                });
                console.log('[useQuestionFlow] /next response:', { ok: res.ok, status: res.status });
                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('[useQuestionFlow] /next error response:', errorText);
                    throw new Error(`next bootstrap failed: ${res.status}`);
                }

                const raw = await res.json();
                console.log('[useQuestionFlow] /next json parsed:', raw);

                if (ctrl.signal.aborted || isCleanupCalled) return;

                if ((raw as { done?: boolean }).done) {
                    console.log('[useQuestionFlow] interview done, redirecting...');
                    window.location.assign(`/entrevista/${sessionId}/resultado`);
                    return;
                }

                if (!isMounted || isCleanupCalled) return;
                const q = (raw as { next?: QA }).next ?? (raw as QA);
                console.log('[useQuestionFlow] setting question and preface:', { q });
                setPreface((raw as { preface?: string | null }).preface ?? q?.preface ?? null);
                setQuestion(q);
                setCanSkip((raw as { canSkip?: boolean }).canSkip ?? true);
                console.log('[useQuestionFlow] bootstrap complete!');
            } catch (e) {
                if (isAbortError(e)) {
                    console.log('[useQuestionFlow] aborted (expected)');
                    return;
                }
                console.error('[useQuestionFlow] catch error:', e);
                if (isMounted && !isCleanupCalled) {
                    setTimedOut(true);
                    onAutoBackStart();
                }
            } finally {
                if (isMounted && !isCleanupCalled) {
                    onGuardClear();
                    setLoadingNext(false);
                }
            }
        };

        console.log('[useQuestionFlow] calling runBootstrap');
        runBootstrap();

        return () => {
            console.log('[useQuestionFlow] cleanup unmounting');
            isCleanupCalled = true;
            isMounted = false;
            ctrl.abort();
        }
    }, [sessionId]);

    function beginTransition(payload: NextPayload) {
        lastPayloadRef.current = payload;
        setLoadingNext(true);
        setTimedOut(false);
        setCanSkip(false);
        setPreface(null);
        setQuestion(null);
        onGuardStart(true);
        abortRef.current?.abort();
        abortRef.current = new AbortController();
    }

    async function finishTransition(raw: unknown) {
        try {
            const r = raw as { done?: boolean; next?: QA; canSkip?: boolean; preface?: string | null } | QA;
            if ((r as { done?: boolean }).done) {
                window.location.assign(`/entrevista/${sessionId}/resultado`);
                return;
            }
            const nextQ: QA = (r as { next?: QA }).next ?? (r as QA);
            setPreface((r as { preface?: string | null }).preface ?? nextQ?.preface ?? null);
            setQuestion(nextQ);
            setCanSkip((r as { canSkip?: boolean }).canSkip ?? true);
        } finally {
            onGuardClear();
            setLoadingNext(false);
        }
    }

    async function submitAnswer(answer: string) {
        if (!answer.trim()) return;
        try {
            beginTransition({ answer });
            const r = await fetch(`/api/interview/${sessionId}/next`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: abortRef.current?.signal,
                body: JSON.stringify({ answer }),
            });
            if (!r.ok) throw new Error(`next submit failed: ${r.status}`);
            const raw = await r.json();
            await finishTransition(raw);
        } catch (e) {
            if (isAbortError(e)) return;
            console.warn('[useQuestionFlow] submit error:', e);
            setTimedOut(true);
            onAutoBackStart();
            onGuardClear();
            setLoadingNext(false);
        }
    }

    async function skip() {
        try {
            beginTransition({ skip: true });
            const r = await fetch(`/api/interview/${sessionId}/next`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: abortRef.current?.signal,
                body: JSON.stringify({ skip: true }),
            });
            if (!r.ok) throw new Error(`next skip failed: ${r.status}`);
            const raw = await r.json();
            await finishTransition(raw);
        } catch (e) {
            if (isAbortError(e)) return;
            console.warn('[useQuestionFlow] skip error:', e);
            setTimedOut(true);
            onAutoBackStart();
            onGuardClear();
            setLoadingNext(false);
        }
    }

    async function retryPending() {
        if (!lastPayloadRef.current) return;
        try {
            setTimedOut(false);
            onGuardStart(true);
            abortRef.current?.abort();
            abortRef.current = new AbortController();
            const r = await fetch(`/api/interview/${sessionId}/next`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: abortRef.current.signal,
                body: JSON.stringify(lastPayloadRef.current),
            });
            if (!r.ok) throw new Error(`next retry failed: ${r.status}`);
            const raw = await r.json();
            await finishTransition(raw);
        } catch (e) {
            if (isAbortError(e)) return;
            console.warn('[useQuestionFlow] retry error:', e);
            setTimedOut(true);
            onAutoBackStart();
            onGuardClear();
            setLoadingNext(false);
        }
    }

    return {
        question, preface, canSkip, loadingNext, timedOut,
        submitAnswer, skip, retryPending,
    };
}