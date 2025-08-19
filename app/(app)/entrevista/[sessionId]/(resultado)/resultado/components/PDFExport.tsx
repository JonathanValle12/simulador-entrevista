'use client';

import { useEffect } from 'react';
import type { InterviewResult } from '@/app/types/result';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfStylesObj } from '@/app/lib/pdf/theme';

type QuestionPDF = InterviewResult['questions'][number] & {
  score?: number;
  timeSec?: number;
  feedback?: string;
  userAnswer?: string;
  strengths?: string[];
  improvements?: string[];
  category?: string;
  timeLabel?: string;
  title?: string;
};

export default function PDFExport({ data, fileName = 'resultado.pdf' }: { data: InterviewResult; fileName?: string }) {
  useEffect(() => {
    async function onDownload(ev: Event) {
      const s = StyleSheet.create(pdfStylesObj);
      const detail = (ev as CustomEvent)?.detail as { sessionId?: string } | undefined;
      const finalName = detail?.sessionId ? `entrevista-${detail.sessionId}.pdf` : fileName;

      const t = (sec?: number) => (sec == null ? '-' : `${Math.floor(sec/60)}m ${Math.round(sec%60)}s`);
      const pct = (n: number, d: number) => (d ? Math.round((n/d)*100) : 0);

      const { overallScore, totalAnswered, totalPlanned, time, recommendations, nextSteps, questions } = data;
      const totalSec = time?.totalSec ?? 0;
      const answeredPct = pct(totalAnswered, totalPlanned);
      const avgSec = totalAnswered ? Math.round(totalSec / totalAnswered) : 0;

      const Stat = ({ label, value }: { label: string; value: string | number }) => (
        <View style={s.statWrap}>
          <Text style={s.statLabel}>{label}</Text>
          <Text style={s.statValue}>{String(value)}</Text>
        </View>
      );

      const List = ({ title, items }: { title: string; items?: readonly string[] }) => (
        <View style={s.col}>
          <Text style={s.h2}>{title}</Text>
          <View style={s.list}>
            {items?.length
              ? items.map((x, i) => (
                  <View key={i} style={s.liRow}>
                    <Text style={s.bullet}>•</Text>
                    <Text style={s.liText}>{x}</Text>
                  </View>
                ))
              : <Text style={s.muted}>Sin datos.</Text>}
          </View>
        </View>
      );

      const Question = ({ q }: { q: QuestionPDF }) => (
        <View style={{ marginTop: 18 }}>
          <Text style={s.h2}>{`Pregunta ${q.index + 1}`}</Text>
          {q.title ? <Text style={s.muted}>{q.title}</Text> : null}

          <View style={s.tagRow}>
            {q.score != null && <Text style={s.tag}>Score: {q.score}</Text>}
            {q.timeSec != null && <Text style={s.tag}>Tiempo: {t(q.timeSec)}</Text>}
            {q.category && <Text style={s.tag}>{q.category}</Text>}
            {q.timeLabel && <Text style={s.tag}>{q.timeLabel}</Text>}
          </View>

          {q.userAnswer ? (
            <View style={{ marginTop: 12 }}>
              <Text style={s.h2}>Tu respuesta</Text>
              <Text>{q.userAnswer}</Text>
            </View>
          ) : null}

          {q.feedback ? (
            <View style={s.info}>
              <Text style={s.h2}>Feedback</Text>
              <Text>{q.feedback}</Text>
            </View>
          ) : null}

          {(q.strengths?.length || q.improvements?.length) ? (
            <View style={[s.row, { marginTop: 14 }]}>
              <List title="Fortalezas" items={q.strengths ?? []} />
              <List title="Áreas de mejora" items={q.improvements ?? []} />
            </View>
          ) : null}

          <View style={s.divider} />
        </View>
      );

      const Doc = (
        <Document>
          <Page size="A4" style={s.page}>
            <View style={s.header} fixed>
              <Text style={s.h1}>Resultados de Entrevista</Text>
              <Text style={s.sub}>Tiempo total: {t(totalSec)}</Text>
            </View>

            <View style={[s.section, s.row]}>
              <Stat label="Score" value={overallScore} />
              <Stat label="Respondidas" value={`${totalAnswered}/${totalPlanned} (${answeredPct}%)`} />
              <Stat label="Tiempo medio" value={t(avgSec)} />
            </View>

            <View style={[s.section, s.row]}>
              <List title="Recomendaciones" items={recommendations ?? []} />
              <List title="Próximos pasos" items={nextSteps ?? []} />
            </View>

            <View style={s.section}>
              {(questions ?? []).map((q) => <Question key={q.index} q={q as QuestionPDF} />)}
            </View>

            <Text style={s.footer} fixed render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
          </Page>
        </Document>
      );

      const blob = await pdf(Doc).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = finalName; a.click();
      URL.revokeObjectURL(url);
    }

    document.addEventListener('download-pdf', onDownload as EventListener);
    return () => document.removeEventListener('download-pdf', onDownload as EventListener);
  }, [data, fileName]);

  return null;
}