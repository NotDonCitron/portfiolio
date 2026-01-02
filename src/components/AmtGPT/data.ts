import type { Problem, Stat, Source } from './types';

export const problems: Problem[] = [
  {
    id: "password",
    title: "❌ Passwort vergessen",
    response: "Wir senden Ihnen einen PIN-Brief per Post. Erwarten Sie die Zustellung in 5–7 Werktagen.",
    reason: "Fehlender E-Mail-Reset-Flow; nur PIN-Brief-Erzwingung als 'Sicherheits'-Übertrieb",
    severity: "HIGH",
    tags: ["Authentication", "Medienbruch"]
  },
  {
    id: "upload",
    title: "📁 Upload bricht ab (2,1 MB Datei)",
    response: "Ihre Datei ist mit 2,1 MB zu groß. Unser Mainframe benötigt Entschlackung. Maximale Größe: 2,0 MB.",
    reason: "2 MB Hard-Limit aus COBOL-Legacy (40 Jahre alt), Array-Größe ist fest kompiliert",
    severity: "MEDIUM",
    tags: ["Technical Debt", "COBOL"]
  },
  {
    id: "timeout",
    title: "⏰ Sitzung abgestürzt (nach 5 Min)",
    response: "Die 5-Minuten-Meditation war erfolgreich. Ihre Daten wurden zum Schutz gelöscht. Bitte starten Sie von vorne.",
    reason: "5-Minuten Session-Timeout ohne Auto-Save oder Vorwarnung; bei komplexen Anträgen führt dies zu Abbruch",
    severity: "CRITICAL",
    tags: ["Session Management", "UX"]
  },
  {
    id: "bundid",
    title: "🔐 BundID: 'Technischer Fehler'",
    response: "Verbindung zu 127.0.0.1:24727 fehlgeschlagen. Haben Sie die AusweisApp2 auf Ihrem PC installiert? Zwei Geräte nötig.",
    reason: "BundID-Architektur erfordert lokale Kommunikation zwischen Smartphone & PC; Browser-Inkompatibilität, Firewall-Probleme",
    severity: "CRITICAL",
    tags: ["BundID", "Authentication"]
  },
  {
    id: "matching",
    title: "🤔 Warum 'Kindergarten-Betreuung'?",
    response: "Unser DKZ-Katalog hat 'Python' als 'Tierpflege' klassifiziert. Bewerben Sie sich im Zoo. Ablehnung = Sanktionsrisiko.",
    reason: "Algorithmic Mismatch durch Keyword-Wildcard-Assoziationen; keine Zumutbarkeitsprüfung vor Vermittlungsvorschlag",
    severity: "CRITICAL",
    tags: ["Matching-Bug", "DKZ"]
  },
  {
    id: "phone",
    title: "☎️ Ich habe Angst vor Telefonaten",
    response: "Das ist ein Problem mit Ihnen. Die Hotline erreichen Sie unter XXXX-XXXX (unterdrückte Nummer). Gerne rufen wir Sie an.",
    reason: "Telefon ist erzwungene Lösung; Viele Sachbearbeiter rufen aus Home-Office mit unterdrückter Nummer an; Phone Anxiety wird ignoriert",
    severity: "CRITICAL",
    tags: ["Phone Anxiety", "Sludge Design"]
  },
  {
    id: "weekend",
    title: "📴 Website offline am Wochenende",
    response: "Freitag 18:00 bis Montag 06:00: Wartung für nächtliche Batch-Läufe. COBOL-Mainframe braucht Schlaf.",
    reason: "Batch-Processing-Architektur; nächtliche Synchronisation; keine Redundanz oder 24/7-Verfügbarkeit",
    severity: "MEDIUM",
    tags: ["Batch Processing", "Availability"]
  },
  {
    id: "german",
    title: "📝 12-seitiges Formular, schwache Deutschkenntnisse",
    response: "'Mitwirkungspflichten', 'Eingliederungsverwaltungsakt', 'Zumutbarkeitsprüfung' – das ist Deutsch. Bitte rufen Sie an.",
    reason: "Behördendeutsch als bewusste Sludge-Strategie zur Reduktion der Inanspruchnahme",
    severity: "HIGH",
    tags: ["Sludge Design", "Complexity"]
  },
  {
    id: "outage",
    title: "💥 Rechenzentrum komplett offline",
    response: "Rechenzentren waren übergelastet. Keine Notstrom. Kein Failover. Sie sind selbst schuld.",
    reason: "Einzelnes Rechenzentrum ohne Redundanz; Bundesrechnungshof: Nur 10% erfüllen BSI-Mindeststandard",
    severity: "CRITICAL",
    tags: ["Infrastructure", "Redundancy"]
  },
  {
    id: "sync",
    title: "📊 Änderung sichtbar erst nach 48h",
    response: "Ihre Online-Eingabe wird erst in der nächtlichen Batch um 22:00 synchronisiert. Sachbearbeiter sieht es dann Montag.",
    reason: "VerBIS Batch-Processing mit 24-48h Latenz; asynchrone Web→Mainframe & Mainframe→Web Sync",
    severity: "HIGH",
    tags: ["Batch Processing", "Sync"]
  }
];

export const stats: Stat[] = [
  { value: "60%", label: "Nicht-Inanspruchnahme (Grundsicherung)" },
  { value: "5 Min", label: "Session-Timeout" },
  { value: "2 MB", label: "Max. Datei-Upload" },
  { value: "40+ Jahre", label: "COBOL-Legacy" }
];

export const sources: Source[] = [
  {
    badge: "Behörde",
    title: "Bundesrechnungshof (2025)",
    description: "Verwaltungsdigitalisierung: Empfehlungen für die 21. Legislaturperiode – Kritik an IT-Redundanz & Session-Management"
  },
  {
    badge: "Akademie",
    title: "Herd & Moynihan (2022)",
    description: "Administrative Burden Framework – Learning, Compliance, Psychological Costs"
  },
  {
    badge: "Forschung",
    title: "Sievert & Bruder (2024)",
    description: "Administrative Burden and Policy Perceptions – Deutsche Fallstudie"
  },
  {
    badge: "Institut",
    title: "WSI / Kaps (2023)",
    description: "Digitalisierung in der BA – VerBIS, Batch-Processing-Architektur"
  }
];
