// Research data extracted from the 8,500-word dossier
// Source: amt-gpt-dossier.md

export interface ArchitectureSection {
  title: string;
  diagram: string;
  description: string;
}

export interface BurdenCost {
  type: string;
  definition: string;
  example: string;
  icon: string;
}

export interface ErrorCode {
  id: string;
  title: string;
  description: string;
  cause: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

export interface UserQuote {
  metaphor: string;
  quote: string;
  rating: string;
}

export interface Source {
  category: string;
  title: string;
  year: string;
  description: string;
}

// ASCII Architecture Diagram - Frankenstein Stack
export const architectureDiagram: ArchitectureSection = {
  title: "Der 'Frankenstein-Stack'",
  diagram: `┌─────────────────────────────────────────────────┐
│  BA-Portal (Web-Frontend, moderne Tech)         │
│  (Node.js / React / Java Spring, Nürnberg 2010) │
└──────────────┬──────────────────────────────────┘
               │
               │ HTTPS (REST/SOAP)
               ↓
┌─────────────────────────────────────────────────┐
│  Middleware Layer (Service Bus)                  │
│  (Message Queue, SOAP Gateway)                   │
└──────────────┬──────────────────────────────────┘
               │
               │ Batch-Job-Scheduler
               ↓ (nachts 22:00 - 06:00)
┌─────────────────────────────────────────────────┐
│  IBM MAINFRAME (z/OS)                           │
│  ├─ COBOL-Programme (VerBIS-Core)              │
│  ├─ CICS Transaction Server                     │
│  ├─ VSAM/DB2 Database                          │
│  └─ IMS/ISAM Legacy (alte Systeme)             │
│                                                  │
│  BATCH-JOB: "NIGHTLY-SYNC-VERBIS"              │
│  ├─ Read: Oracle Web-DB (+ 24h Daten)         │
│  ├─ Transform: COBOL PROCEDURE DIVISION       │
│  ├─ Load: Mainframe-DB (VSAM, DB2)           │
│  └─ Notify: Sachbearbeiter-Terminals          │
└─────────────────────────────────────────────────┘`,
  description: "Moderne Web-Frontends treffen auf 40+ Jahre alte COBOL-Mainframe-Logik. Änderungen werden erst in nächtlichen Batch-Läufen synchronisiert."
};

// Batch Processing Flow
export const batchProcessingFlow = `Online-Portal (Bürger)
    ↓ [FORM SUBMIT, REAL-TIME]
    → "Temporäre Zwischenspeicherung" (Oracle DB für Webfrontend)
    ↓ [NÄCHTLICHE BATCH-LÄUFE, 22:00 - 06:00 UHR]
    → Mainframe-Datenbank-Sync
    ↓ [+24 bis +48 STUNDEN LATENZ]
    → Sachbearbeiter sieht Änderungen (Terminal: VerBIS)`;

// Administrative Burden Framework (Herd & Moynihan)
export const burdenFramework: BurdenCost[] = [
  {
    type: "Learning Costs",
    definition: "Aufwand, das System zu verstehen",
    example: "8 Behörden × 12 Leistungen = 'Labyrinth'",
    icon: "📚"
  },
  {
    type: "Compliance Costs",
    definition: "Zeit für Formulare, Dokumente, Interviews",
    example: "12-seitiger Antrag ohne Autosave",
    icon: "📝"
  },
  {
    type: "Psychological Costs",
    definition: "Stigma, Angst, Gefühl von Machtlosigkeit",
    example: "Telefon-Zwang, Sanktionsbedrohung",
    icon: "🧠"
  }
];

// COBOL Code Snippet
export const cobolSnippet = `       IDENTIFICATION DIVISION.
       PROGRAM-ID. UPLOAD-FILE-HANDLER.
       
       DATA DIVISION.
       FILE SECTION.
       FD  UPLOAD-FILE.
       01  UPLOAD-RECORD              PIC X(2097152).
                                       *> 2,097,152 BYTES = 2 MB
       
       WORKING-STORAGE SECTION.
       01  WS-MAX-FILE-SIZE           PIC 9(10) VALUE 2097152.
       01  WS-FILE-SIZE               PIC 9(10).
       01  WS-RETURN-CODE             PIC 9(4) VALUE ZERO.
       
       PROCEDURE DIVISION.
       
           ACCEPT WS-FILE-SIZE.
           
           IF WS-FILE-SIZE > WS-MAX-FILE-SIZE
               MOVE 400 TO WS-RETURN-CODE
               DISPLAY "TECHNISCHER FEHLER: DATEI ZU GROSS"
               STOP RUN
           END-IF.`;

// Error Gallery
export const errorGallery: ErrorCode[] = [
  {
    id: "127.0.0.1:24727",
    title: "BundID Localhost-Fehler",
    description: "Verbindung zu 127.0.0.1:24727 fehlgeschlagen",
    cause: "AusweisApp2 läuft nicht auf dem PC, Firewall blockiert, Browser-Inkognito aktiv",
    severity: "CRITICAL"
  },
  {
    id: "SESSION_EXPIRED",
    title: "Session-Timeout nach 5 Minuten",
    description: "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.",
    cause: "Aggressive 5-Minuten-Invalidierung ohne Autosave oder Vorwarnung",
    severity: "CRITICAL"
  },
  {
    id: "FILE_TOO_LARGE",
    title: "Upload-Limit überschritten",
    description: "Ihre Datei ist zu groß. Maximum: 2,0 MB",
    cause: "COBOL-Array mit fester Größe (40 Jahre alt), Recompilation unmöglich",
    severity: "MEDIUM"
  },
  {
    id: "PASSPHRASE_INVALID",
    title: "PIN-Brief Endlosschleife",
    description: "Passphrase ungültig (obwohl korrekt eingegeben)",
    cause: "COBOL-Stringvalidierung mit falscher Encoding-Konversion (UTF-8 vs. EBCDIC)",
    severity: "HIGH"
  },
  {
    id: "BATCH_PENDING",
    title: "Änderung noch nicht sichtbar",
    description: "Ihre Eingabe wird erst nach dem nächsten Batch-Lauf synchronisiert",
    cause: "Nächtliche Batch-Läufe, 24-48h Latenz zwischen Web und Mainframe",
    severity: "HIGH"
  }
];

// User Quotes / Metaphors from Trustpilot & Forums
export const userQuotes: UserQuote[] = [
  {
    metaphor: "Beta-Version im Live-Betrieb",
    quote: "Das System fühlt sich an, als wäre es nie getestet worden.",
    rating: "1.2 / 5 ⭐"
  },
  {
    metaphor: "Kafkaeskes Büro-Labyrinth",
    quote: "Du wirst in Endlosschleifen festgehalten und weißt nicht, wer dich verwaltet.",
    rating: "1.5 / 5 ⭐"
  },
  {
    metaphor: "Digitale Totmannschaltung",
    quote: "Session-Timeout ist wie eine Notbremse im Zug – einfach brutal.",
    rating: "1.8 / 5 ⭐"
  },
  {
    metaphor: "Hölle auf Erden",
    quote: "Wenn du depressiv bist und brauchst Hilfe, ist BA das Schlechteste, was dir passieren kann.",
    rating: "1.2 / 5 ⭐"
  }
];

// Behördendeutsch Examples
export const behoerdendeutsch = [
  { term: "Eingliederungsverwaltungsakt", meaning: "Verwaltungsakt zur Eingliederung", problem: "4 Silben = kognitiv belastet" },
  { term: "Mitwirkungspflichten", meaning: "Pflicht zu mitarbeiten", problem: "Klingt wie 'Strafe'" },
  { term: "Zumutbarkeitsprüfung", meaning: "Ist diese Stelle für Sie zumutbar?", problem: "Unverständlich" },
  { term: "Sanktionsrecht gemäß § 31 SGB II", meaning: "Wir können Ihre Leistung kürzen", problem: "Juristisch formuliert" },
];

// Research Sources
export const researchSources: Source[] = [
  {
    category: "Akademie",
    title: "Herd & Moynihan",
    year: "2022",
    description: "Administrative Burden Framework – Learning, Compliance, Psychological Costs"
  },
  {
    category: "Behörde",
    title: "Bundesrechnungshof",
    year: "2025",
    description: "Verwaltungsdigitalisierung: Empfehlungen für die 21. Legislaturperiode"
  },
  {
    category: "Forschung",
    title: "Sievert & Bruder",
    year: "2024",
    description: "Administrative Burden and Policy Perceptions – Deutsche Fallstudie"
  },
  {
    category: "Institut",
    title: "WSI / Kaps",
    year: "2023",
    description: "Digitalisierung in der Bundesagentur für Arbeit – VerBIS, Batch-Processing"
  },
  {
    category: "Technik",
    title: "AusweisApp FAQ",
    year: "2025",
    description: "127.0.0.1:24727 Fehler, Browser-Inkompatibilität, lokale Auth-Probleme"
  },
  {
    category: "Nutzer",
    title: "Reddit, Trustpilot, Foren",
    year: "2024-25",
    description: "Session-Timeout-Beschwerden, Upload-Limit-Frustration, Phone-Anxiety"
  }
];

// Vision for improvement
export const improvementVision = [
  {
    title: "Once-Only-Prinzip",
    description: "Daten werden zwischen Behörden geteilt. Antrag nur einmal ausfüllen.",
    icon: "🔄"
  },
  {
    title: "Async-First Architektur",
    description: "Schriftliche Tickets statt Telefonzwang. E-Mail-Bestätigung statt Session-Timeout.",
    icon: "📧"
  },
  {
    title: "Plain Language",
    description: "Bescheide in 'Leichte Sprache' übersetzen. Multi-Lingual Support.",
    icon: "💬"
  },
  {
    title: "Psychologische Entlastung",
    description: "Wahl zwischen Telefon/Email/Chat. Keine unterdrückten Nummern.",
    icon: "🧘"
  }
];