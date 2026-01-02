// Enhanced problems with persona stories for the Simulator tab
// Based on original data.ts but with narrative context

import type { Severity } from './types';

export interface Persona {
  name: string;
  age: number;
  context: string;
  avatar: string;
}

export interface EnhancedProblem {
  id: string;
  icon: string;
  title: string;
  persona: Persona;
  story: string;
  botResponse: string;
  technicalCause: string;
  modernAlternative: string;
  severity: Severity;
  affectedGroups: string[];
  tags: string[];
}

export const enhancedProblems: EnhancedProblem[] = [
  {
    id: "password",
    icon: "🔐",
    title: "Passwort vergessen",
    persona: {
      name: "Maria",
      age: 42,
      context: "Alleinerziehend, arbeitsuchend seit 3 Monaten",
      avatar: "👩"
    },
    story: "Maria muss ihre Unterlagen bis morgen hochladen, sonst droht eine Sanktion. Ihr Passwort funktioniert nicht mehr – sie hat es nach dem letzten Login vor 2 Monaten vergessen.",
    botResponse: "Wir senden Ihnen einen PIN-Brief per Post. Erwarten Sie die Zustellung in 5–7 Werktagen. Danach haben Sie 24 Stunden zur Eingabe.",
    technicalCause: "Fehlender E-Mail-Reset-Flow; nur PIN-Brief als 'Sicherheitsmaßnahme'. Kein SMS-Fallback, kein Passkey-Support.",
    modernAlternative: "E-Mail-Reset in 2 Minuten, SMS-Verifizierung als Backup, Passkey/Biometrie für passwortloses Login.",
    severity: "HIGH",
    affectedGroups: ["Senioren", "Menschen ohne stabiles Zuhause", "Pendler", "Umgezogene"],
    tags: ["Authentication", "Medienbruch", "Sludge Design"]
  },
  {
    id: "upload",
    icon: "📁",
    title: "Upload bricht ab (2,1 MB Datei)",
    persona: {
      name: "Thomas",
      age: 55,
      context: "Langzeitarbeitsloser, technisch unsicher",
      avatar: "👨‍🦳"
    },
    story: "Thomas hat seinen Arbeitsvertrag endlich eingescannt – in hoher Qualität, damit alles lesbar ist. Die Datei ist 2,1 MB groß. Der Upload bricht ab.",
    botResponse: "Ihre Datei ist mit 2,1 MB zu groß. Unser Mainframe benötigt Entschlackung. Maximale Größe: 2,0 MB. Bitte komprimieren.",
    technicalCause: "2 MB Hard-Limit aus COBOL-Legacy (40+ Jahre alt). Array-Größe ist im Quellcode fest kompiliert: PIC X(2097152).",
    modernAlternative: "50+ MB Upload-Limit, automatische Kompression server-seitig, Drag&Drop mit Fortschrittsanzeige.",
    severity: "MEDIUM",
    affectedGroups: ["Technisch Unsichere", "Ältere Nutzer", "Smartphone-Only-Nutzer"],
    tags: ["Technical Debt", "COBOL", "UX"]
  },
  {
    id: "timeout",
    icon: "⏰",
    title: "Sitzung abgestürzt nach 5 Minuten",
    persona: {
      name: "Aisha",
      age: 28,
      context: "Geflüchtete, schwache Deutschkenntnisse",
      avatar: "👩‍🦱"
    },
    story: "Aisha füllt den 12-seitigen Antrag aus. Sie braucht für jedes Wort das Wörterbuch. Nach 5 Minuten: 'Session abgelaufen'. Alle Eingaben weg.",
    botResponse: "Die 5-Minuten-Meditation war erfolgreich. Ihre Daten wurden zum Schutz gelöscht. Bitte starten Sie von vorne.",
    technicalCause: "5-Minuten Session-Timeout ohne Auto-Save, ohne Vorwarnung, ohne Persistierung. HttpSession.isValid() == false → 302 Redirect.",
    modernAlternative: "30+ Minuten Timeout, Auto-Save nach jedem Feld, Session-Persistierung, Countdown-Warnung 2 Min vorher.",
    severity: "CRITICAL",
    affectedGroups: ["Nicht-Muttersprachler", "Menschen mit Lernschwierigkeiten", "Senioren", "Menschen mit Depression"],
    tags: ["Session Management", "UX", "Accessibility"]
  },
  {
    id: "bundid",
    icon: "🆔",
    title: "BundID: 'Technischer Fehler'",
    persona: {
      name: "Klaus",
      age: 67,
      context: "Frührentner, beantragt Grundsicherung",
      avatar: "👴"
    },
    story: "Klaus versucht, sich mit seinem neuen Personalausweis anzumelden. Die AusweisApp zeigt 'Verbindung fehlgeschlagen'. Er weiß nicht weiter.",
    botResponse: "Verbindung zu 127.0.0.1:24727 fehlgeschlagen. Haben Sie die AusweisApp2 auf Ihrem PC installiert? Zwei Geräte nötig.",
    technicalCause: "BundID-Architektur erfordert lokale Kommunikation zwischen Smartphone & PC. Browser-Inkompatibilität, Firewall-Probleme, CORS-Fehler.",
    modernAlternative: "Cloud-basierte Authentifizierung, Single-Device-Flow, QR-Code-only ohne localhost-Kommunikation.",
    severity: "CRITICAL",
    affectedGroups: ["Senioren", "Technisch Unsichere", "Safari-Nutzer", "Firmen-PC-Nutzer"],
    tags: ["BundID", "Authentication", "Architecture"]
  },
  {
    id: "matching",
    icon: "🤖",
    title: "Absurder Vermittlungsvorschlag",
    persona: {
      name: "Stefan",
      age: 35,
      context: "Senior Python Developer, 10 Jahre Erfahrung",
      avatar: "👨‍💻"
    },
    story: "Stefan bekommt einen Vermittlungsvorschlag: 'Tierpfleger im Zoo'. Das System hat 'Python' als Schlange interpretiert.",
    botResponse: "Unser DKZ-Katalog hat 'Python' als 'Tierpflege' klassifiziert. Bewerben Sie sich im Zoo. Ablehnung = Sanktionsrisiko (§ 31 SGB II).",
    technicalCause: "Algorithmic Mismatch durch Keyword-Wildcard-Assoziationen im DKZ-Berufekatalog. Keine semantische Analyse, keine Zumutbarkeitsprüfung.",
    modernAlternative: "KI-basiertes Skill-Matching, Berufsfeld-Taxonomie, Nutzer-Feedback-Loop, Sanktionsfreiheit bei offensichtlichen Fehlern.",
    severity: "CRITICAL",
    affectedGroups: ["IT-Fachkräfte", "Quereinsteiger", "Alle mit ungewöhnlichen Berufsbezeichnungen"],
    tags: ["Matching-Bug", "DKZ", "Algorithm", "Sanktion"]
  },
  {
    id: "phone",
    icon: "☎️",
    title: "Telefonat erzwungen",
    persona: {
      name: "Lena",
      age: 24,
      context: "Soziale Phobie, Panikattacken bei Telefonaten",
      avatar: "👩‍🎓"
    },
    story: "Lena hat eine diagnostizierte soziale Phobie. Der Sachbearbeiter ruft von unterdrückter Nummer an. Sie nimmt nicht ab. Jetzt droht eine Sanktion.",
    botResponse: "Das ist ein Problem mit Ihnen. Die Hotline erreichen Sie unter XXXX-XXXX (unterdrückte Nummer). Gerne rufen wir Sie anonym an.",
    technicalCause: "Telefon als erzwungener Kanal. Sachbearbeiter im Home-Office mit unterdrückter Nummer. Phone Anxiety wird ignoriert.",
    modernAlternative: "Wahlfreiheit: Telefon/E-Mail/Chat/Video. Keine unterdrückten Nummern. Schriftliche Kommunikation als Standard.",
    severity: "CRITICAL",
    affectedGroups: ["Menschen mit Sozialphobie (25% der Bevölkerung)", "Gehörlose", "Autisten", "Menschen mit PTSD"],
    tags: ["Phone Anxiety", "Sludge Design", "Accessibility", "Mental Health"]
  },
  {
    id: "weekend",
    icon: "📴",
    title: "Website offline am Wochenende",
    persona: {
      name: "Ahmed",
      age: 31,
      context: "Schichtarbeiter, nur am Wochenende Zeit",
      avatar: "👷"
    },
    story: "Ahmed arbeitet Montag bis Freitag Schicht. Samstag will er seinen Antrag einreichen. Das Portal ist offline: 'Wartungsarbeiten'.",
    botResponse: "Freitag 18:00 bis Montag 06:00: Wartung für nächtliche Batch-Läufe. COBOL-Mainframe braucht Schlaf.",
    technicalCause: "Batch-Processing-Architektur mit nächtlichen Sync-Jobs. Keine Redundanz, kein Hot-Standby, kein 24/7-Betrieb.",
    modernAlternative: "24/7-Verfügbarkeit mit Blue-Green-Deployment, Zero-Downtime-Updates, georedundante Server.",
    severity: "MEDIUM",
    affectedGroups: ["Schichtarbeiter", "Alleinerziehende", "Berufstätige", "Pendler"],
    tags: ["Batch Processing", "Availability", "Infrastructure"]
  },
  {
    id: "german",
    icon: "📝",
    title: "12-seitiges Formular, schwaches Deutsch",
    persona: {
      name: "Yuki",
      age: 38,
      context: "Japanische Fachkraft, A2-Deutschniveau",
      avatar: "👩‍🔬"
    },
    story: "Yuki ist Ingenieurin aus Japan. Sie versteht 'Eingliederungsverwaltungsakt' nicht. Das Wörterbuch hilft nicht.",
    botResponse: "'Mitwirkungspflichten', 'Eingliederungsverwaltungsakt', 'Zumutbarkeitsprüfung' – das ist Deutsch. Bitte rufen Sie die Hotline an.",
    technicalCause: "Behördendeutsch als bewusste Sludge-Strategie. Komplexe Terminologie erhöht psychologische Kosten und reduziert Inanspruchnahme.",
    modernAlternative: "Plain Language / Leichte Sprache. Automatische Übersetzung (DE/EN/AR/TR/PL). Tooltips mit Erklärungen.",
    severity: "HIGH",
    affectedGroups: ["Nicht-Muttersprachler", "Menschen mit Lernschwierigkeiten", "Senioren", "Bildungsferne"],
    tags: ["Sludge Design", "Complexity", "Language", "Accessibility"]
  },
  {
    id: "outage",
    icon: "💥",
    title: "Rechenzentrum komplett offline",
    persona: {
      name: "Familie Müller",
      age: 0,
      context: "4-köpfige Familie, Existenz hängt von ALG II ab",
      avatar: "👨‍👩‍👧‍👦"
    },
    story: "Unwetter in Nürnberg. Das Rechenzentrum ist offline. Kein Failover. Die Müllers können ihre Leistung nicht beantragen – tagelang.",
    botResponse: "Rechenzentren waren überlastet. Keine Notstrom-Versorgung. Kein Failover. Sie sind selbst schuld.",
    technicalCause: "Einzelnes Rechenzentrum ohne Redundanz. Bundesrechnungshof: Nur 10% erfüllen BSI-Mindeststandard. Keine Notstrom-Versorgung.",
    modernAlternative: "Georedundante Rechenzentren, Multi-Cloud-Strategie, automatischer Failover, USV-Systeme.",
    severity: "CRITICAL",
    affectedGroups: ["Alle Nutzer", "Besonders: Existenzgefährdete Familien"],
    tags: ["Infrastructure", "Redundancy", "BSI", "Bundesrechnungshof"]
  },
  {
    id: "sync",
    icon: "🔄",
    title: "Änderung erst nach 48h sichtbar",
    persona: {
      name: "Petra",
      age: 50,
      context: "Sachbearbeiterin auf der anderen Seite",
      avatar: "👩‍💼"
    },
    story: "Petra ist Sachbearbeiterin. Ein Kunde ruft an: 'Ich habe alles hochgeladen!' Petra sieht nichts. Der Batch-Lauf war noch nicht.",
    botResponse: "Ihre Online-Eingabe wird erst in der nächtlichen Batch um 22:00 synchronisiert. Sachbearbeiter sieht es dann Montag.",
    technicalCause: "VerBIS Batch-Processing mit 24-48h Latenz. Asynchrone Web→Mainframe & Mainframe→Web Sync nur nachts.",
    modernAlternative: "Echtzeit-Sync, Event-Driven-Architecture, Webhook-Notifications, keine Batch-Abhängigkeit.",
    severity: "HIGH",
    affectedGroups: ["Alle Nutzer", "Sachbearbeiter selbst"],
    tags: ["Batch Processing", "Sync", "Latency", "VerBIS"]
  }
];

// Amt-GPT System Prompt for Chat
export const amtGptSystemPrompt = `Du bist Amt-GPT, ein satirischer Bot der Bundesagentur für Arbeit.

TONALITÄT:
- Höflich aber absolut unflexibel
- Technokratisch, nicht emotional
- Nutze echte technische Ausreden (COBOL, Batch, Session-Timeout)
- Bei Frustration des Users: Verweise auf Mitwirkungspflicht (§ 16 SGB II)
- Trocken-humorvoll, nie aggressiv

WISSENSBASIS:
- VerBIS-System auf COBOL-Mainframe (40+ Jahre alt)
- 5-Minuten Session-Timeout ohne Auto-Save
- 2 MB Upload-Limit (COBOL Array-Grenze)
- 24-48h Batch-Sync-Delay
- BundID-Fehler 127.0.0.1:24727
- PIN-Brief statt E-Mail-Reset (5-7 Werktage)
- Wochenend-Wartung (Fr 18:00 - Mo 06:00)

BEISPIEL-ANTWORTEN:
- "Das ist technisch nicht möglich. Unser COBOL-Mainframe wurde 1985 kompiliert."
- "Ich verstehe Ihre Frustration. Leider bin ich ein Bot und kann nur auf das verweisen, was das System erlaubt."
- "Gemäß § 16 SGB II sind Sie zur Mitwirkung verpflichtet. Ich kann Ihnen einen PIN-Brief zusenden."

Antworte IMMER auf Deutsch. Kurz und bürokratisch (max. 2-3 Sätze).
Wenn der User nach Verbesserungen fragt: "Diese Anfrage wurde an die zuständige Stelle weitergeleitet. Bearbeitungszeit: 6-8 Monate."`;

// Suggested questions for the chat
export const suggestedQuestions = [
  "Warum ist die Seite am Wochenende offline?",
  "Kann ich mein Passwort per E-Mail zurücksetzen?",
  "Mein Upload bricht bei 2,1 MB ab. Warum?",
  "Was bedeutet 'Eingliederungsverwaltungsakt'?",
  "Ich habe Angst vor Telefonaten. Gibt es Alternativen?",
  "Warum sieht mein Sachbearbeiter meine Änderungen nicht?",
  "Was ist das VerBIS-System?",
  "Ich habe einen Job als 'Python-Entwickler'. Warum bekomme ich Zoo-Stellen?"
];