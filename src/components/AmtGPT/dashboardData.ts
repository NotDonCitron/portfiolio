// Dashboard data for Amt-GPT Workbench
// Source: Research dossier based on Bundesrechnungshof, Herd & Moynihan, WSI studies

export interface BurdenIndexItem {
  subject: string;
  value: number;
  fullMark: number;
}

export interface ComparisonItem {
  metric: string;
  ba: number;
  modern: number;
  unit: string;
}

export interface KeyStat {
  value: string;
  label: string;
  source: string;
  icon: string;
}

export interface TrustpilotData {
  rating: number;
  reviews: number;
  quotes: string[];
}

// Radar chart data - Administrative Burden Index
export const burdenIndex: BurdenIndexItem[] = [
  { subject: 'Lernaufwand', value: 85, fullMark: 100 },
  { subject: 'Nachweispflichten', value: 78, fullMark: 100 },
  { subject: 'Psych. Belastung', value: 92, fullMark: 100 },
  { subject: 'Techn. Hürden', value: 88, fullMark: 100 },
  { subject: 'Zeitaufwand', value: 75, fullMark: 100 },
];

// Comparison: BA-Portal vs Modern Standards
export const comparisonData: ComparisonItem[] = [
  { metric: 'Session-Timeout', ba: 5, modern: 30, unit: 'min' },
  { metric: 'Upload-Limit', ba: 2, modern: 50, unit: 'MB' },
  { metric: 'Sync-Delay', ba: 48, modern: 0, unit: 'h' },
  { metric: 'Autosave', ba: 0, modern: 100, unit: '%' },
];

// Key statistics with sources
export const keyStats: KeyStat[] = [
  { 
    value: "60%", 
    label: "Nicht-Inanspruchnahme", 
    source: "Herd & Moynihan 2022",
    icon: "📉"
  },
  { 
    value: "40+", 
    label: "Jahre COBOL-Legacy", 
    source: "WSI 2023",
    icon: "🖥️"
  },
  { 
    value: "5", 
    label: "Min Session-Timeout", 
    source: "Bundesrechnungshof 2025",
    icon: "⏰"
  },
  { 
    value: "24-48h", 
    label: "Sync-Delay", 
    source: "IAB 2024",
    icon: "🔄"
  }
];

// Trustpilot-style rating
export const trustpilotData: TrustpilotData = {
  rating: 1.2,
  reviews: 847,
  quotes: [
    "Beta-Version im Live-Betrieb",
    "Kafkaeskes Büro-Labyrinth",
    "Digitale Totmannschaltung",
    "Hölle auf Erden"
  ]
};

// Non-take-up rates by category
export const nonTakeUpRates = [
  { category: 'Grundsicherung im Alter', rate: 60, reason: 'Administrative Burden + Stigma' },
  { category: 'Arbeitslosengeld II', rate: 35, reason: 'Session-Timeout, Komplexität' },
  { category: 'Kindergeld-Zuzahlung', rate: 22, reason: 'BundID-Fehler' },
];

// Bundesrechnungshof findings
export const brhFindings = [
  { status: '❌', finding: 'IT-Controlling Bund fehlt' },
  { status: '❌', finding: 'Nur 10% der Rechenzentren erfüllen BSI-Mindeststandard' },
  { status: '❌', finding: 'Keine Notstrom-Redundanz' },
  { status: '❌', finding: 'Kein zentrales IT-Governance' },
  { status: '❌', finding: 'Parallelentwicklungen (verschiedene Behörden)' },
];