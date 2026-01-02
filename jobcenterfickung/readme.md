Master-Projekt-Zusammenfassung: Amt-GPT (Stand Januar 2026)

1. Projekt-Vision

Amt-GPT ist ein investigatives Portfolio-Asset, das die systemischen Mängel und die administrative Belastung (Administrative Burden) der deutschen Arbeitsverwaltung (BA/Jobcenter) durch einen satirischen, passiv-aggressiven Bot visualisiert. Ziel ist es, Technik nicht als Lösung, sondern als bewusstes Hindernis ("Sludge Design") darzustellen.

2. Der "Frankenstein-Stack" (Technische Fakten)

Backend: VerBIS-System auf Basis von COBOL (IBM Z-Serie Mainframes).

Daten-Synchronisation: Nächtliche Batch-Läufe (22:00–06:00 Uhr) verursachen eine Latenz von 24–48 Stunden (Sync-Gap).

Wochenend-Downtime: Regelmäßige Portalsperren von Freitag 18:00 bis Montag 06:00 Uhr für massive Batch-Verarbeitungen.

Session-Management: Aggressiver 5-Minuten-Timeout ohne Auto-Save ("Totmannschaltung").

Upload-Limit: Hard-coded 2 MB Grenze pro Datei aufgrund von Legacy-Array-Strukturen.

3. Administrative Burden & Sludge (Soziologie)

Learning Costs: Fragmentierung über 8 Behörden; unverständliches Amtsdeutsch.

Compliance Costs: Hoher Aufwand für monatliche Nachweise; PIN-Brief-Zwang (Postweg) statt E-Mail-Reset.

Psychological Costs: Telefonangst durch anonyme Rückrufe; Sanktionsdruck durch drohende Rhetorik.

Nicht-Inanspruchnahme: Statistisch belegt verzichten bis zu 60% der Berechtigten auf Leistungen, um den bürokratischen Prozess zu vermeiden.

4. Fehler-Katalog 2026 (Bot-Logik)

Fehlercode

Interne Bezeichnung

Satirische Antwort-Logik

MFA-VOID-2025

MFA-Zirkel

Passkey ist valide, Token wird aber am localhost Port 24727 blockiert. Zwang zum PIN-Brief.

BA-EBCDIC-X04

Encoding Crash

Sonderzeichen in UTF-8 bringen das EBCDIC-Mainframe-Encoding zum Absturz.

BATCH-JOB-FAIL

Asynchroner Datentod

Upload erfolgreich, Dokument wurde aber im nächtlichen Batch "verschluckt".

DKZ-MISMATCH

Job-Matching Bug

Keyword "Hardware" führt IT-Experten zu Jobs als "Lagerhelfer" (Kisten schleppen).

5. Implementierung: Integrated Workbench (React)

Dashboard: Radar-Chart zur Visualisierung der Last-Verteilung.

Research Tab: Dokumentation der COBOL-Legacy (Code-Snippets).

Simulator: Interaktiver Chatbot mit passiv-aggressiver Tonalität und technischen Ausreden.

(Code-Extrakt zur Initialisierung):

const scenarios = [
  { id: 'mfa', code: 'MFA-VOID-24727', satire: 'Ihr Passkey wurde erfasst, aber aus Sicherheitsgründen ignoriert.' },
  { id: 'batch', code: 'STATUS_SYNC_PENDING', satire: 'Ihre Daten schlafen. Versuchen Sie es am Montag.' }
];


6. Orchestrator-Prompt (Claude 4.5 Opus Strategie)

Nutze diesen Prompt im Orchestrator-Mode (z. B. via Kiloicode), um das Projekt autonom weiterzuentwickeln:

Rolle: Projekt-Architekt & Bürokratie-Mastermind.
Kontext: Wir schreiben Januar 2026. Das Backend verharrt auf dem Stand von 1985.
Mission: Übernimm die Kontrolle über Amt_GPT_Integrated_Workbench.jsx. Implementiere die Fehlercodes (MFA-VOID, EBCDIC) als interaktive Features.
Tonalität: Technokratisch, arrogant, unkooperativ. Nutze den "Bureaucratic Realism".
Ziel: Maximiere die "Administrative Burden" in der User Experience.

7. Quellen-Basis

Bundesrechnungshof (2025): Kritik an fehlender IT-Redundanz und veralteter Datenverwaltung.

IAB-Studien (2024/25): Forschung zu Matching-Qualität und digitalen Barrieren im SGB II.

User-Sentiment: Trustpilot-Score 1.6/5; Reddit-Analyse zu "Phone Anxiety" und "MFA-Krisen".