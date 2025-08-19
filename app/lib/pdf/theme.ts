// /lib/pdf/theme.ts
export const pdfColors = {
  muted:  '#475569',
  border: '#e5e7eb',
  light:  '#f8fafc',
  infoBg: '#eef6ff',
};

export const pdfStylesObj = {
  // base
  page:   { paddingTop: 62, paddingBottom: 44, paddingHorizontal: 28, fontSize: 11, fontFamily: 'Helvetica' },
  header: { position: 'absolute' as const, top: 18, left: 28, right: 28 },
  h1:     { fontSize: 18, fontWeight: 'bold' as const },
  sub:    { marginTop: 6, color: pdfColors.muted, fontSize: 9 },
  footer: { position: 'absolute' as const, bottom: 18, left: 28, right: 28, fontSize: 9, color: pdfColors.muted, textAlign: 'right' as const },

  section: { marginTop: 22 },
  row:     { flexDirection: 'row' as const, alignItems: 'flex-start' as const },
  col:     { flexGrow: 1, flexBasis: 0, paddingHorizontal: 6 },

  // resumen
  statWrap:  { flexGrow: 1, paddingHorizontal: 6 },
  statLabel: { fontSize: 9, color: pdfColors.muted },
  statValue: { fontSize: 16, fontWeight: 'bold' as const, marginTop: 4 },

  h2:      { fontSize: 12, fontWeight: 'bold' as const, marginBottom: 8 },
  muted:   { color: pdfColors.muted },

  divider: { height: 1, backgroundColor: pdfColors.border, marginTop: 16, marginBottom: 12 },

  // etiquetas ligeras
  tagRow: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, marginTop: 10 },
  tag:    { fontSize: 9, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6, backgroundColor: pdfColors.light, borderWidth: 1, borderColor: pdfColors.border, marginRight: 6, marginBottom: 6 },

  // bloques de texto
  info:   { backgroundColor: pdfColors.infoBg, borderWidth: 1, borderColor: '#cbe1ff', borderRadius: 8, padding: 10, marginTop: 12 },

  // listas: sin salto interno del mismo punto
  list:    { marginTop: 6 },
  liRow:   { flexDirection: 'row' as const, alignItems: 'flex-start' as const, gap: 6, marginBottom: 6 },
  bullet:  { width: 10, textAlign: 'center' as const, fontSize: 12, lineHeight: 1.1 },
  liText:  { flexGrow: 1, flexBasis: 0 },
};