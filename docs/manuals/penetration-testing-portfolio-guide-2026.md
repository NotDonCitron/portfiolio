# Penetration Testing & Security Testing Portfolio Roadmap 2026

## Executive Summary

Um in der Penetration Testing und Security Testing Branche erfolgreich zu sein und als Top-Kandidat wahrgenommen zu werden, benötigst du ein starkes, professionell dokumentiertes Portfolio, das deine praktischen Fähigkeiten unter Beweis stellt. Dieser Leitfaden basiert auf aktuellen Jobmarkt-Anforderungen (Januar 2026) und zeigt dir konkrete Schritte zur Portfolio-Optimierung.

---

## 1. MARKTANALYSE & AKTUELLE ANFORDERUNGEN

### 1.1 Marktgröße & Wachstum
- **Global Market Size 2025**: USD 2,34 Milliarden
- **Projected 2032**: USD 6,25 Milliarden
- **CAGR**: 18,7% (schneller Wachstum!)
- **Mobile Pentesting Growth**: 20,7% CAGR (noch schneller!)

### 1.2 Gehaltsperspektiven (Deutschland)

| Position | Erfahrung | Gehalt | Salary Range |
|----------|-----------|--------|--------------|
| Junior Penetration Tester | 1-3 Jahre | €42.800 | €37.000 - €44.000 |
| Senior Penetration Tester | 3-6 Jahre | €56.600 | €52.400 - €59.400 |
| Lead Penetration Tester | > 6 Jahre | €63.200 | €61.100 - €67.400 |

**Senior Remote Positionen**: €6.500-€8.000+ (abhängig von Erfahrung & Verhandlung)

### 1.3 Job Market Trends

**40% der Positionen** erfordern KEINE klassische Universitätsausbildung (Fokus auf Skills & Certifications)
**60% erfordern** Bachelor-Grad oder höher (aber Skills sind Priorität!)
**100% erfordern** praktische Nachweise deiner Fähigkeiten

---

## 2. KRITISCHE FÄHIGKEITEN FÜR DEIN PORTFOLIO

### 2.1 Core Technical Skills (MUSS HABEN)

**Networking Fundamentals**
- TCP/IP, DNS, HTTP/HTTPS Protokolle
- Routing, Subnetting, NAT
- Common Ports & Services

**Operating System Mastery**
- Linux (Permissions, Processes, Bash, Services)
- Windows (AD, PowerShell, Registry, Security Policies)
- Both systems' privilege escalation techniques

**Programming & Scripting**
- Python (Automation, Tool Development)
- Bash (Linux workflows)
- PowerShell (Windows environments)

**Web Application Security**
- OWASP Top 10 (2021 Version)
- Broken Access Control
- Cryptographic Failures
- Injection Vulnerabilities
- Insecure Design & Misconfigurations
- Authentication & Session Management Flaws

**Cloud Security Basics**
- AWS/Azure/GCP IAM & Access Control
- Misconfiguration Detection
- Storage Exposure Testing
- API Security

### 2.2 Specialization Areas (WÄHLE MINDESTENS 1-2)

**Web Application Penetration Testing**
- SQL Injection (SQLi)
- Cross-Site Scripting (XSS)
- Server-Side Request Forgery (SSRF)
- Insecure Direct Object References (IDOR)
- Cross-Site Request Forgery (CSRF)
- API Security Testing

**Network Penetration Testing**
- Network Scanning & Enumeration
- Network Exploitation
- Privilege Escalation
- Lateral Movement
- Command & Control (C2) Operations

**Cloud Security Testing**
- AWS Lambda/EC2/S3 Vulnerabilities
- Azure AD & Function Security
- GCP IAM Misconfigurations
- Container & Kubernetes Security

**Active Directory Exploitation** (sehr gefragt!)
- Enumeration & Mapping
- Kerberos Attacks
- Privilege Escalation
- Domain Trust Exploitation
- Lateral Movement in AD Environments

### 2.3 Tool Mastery (SEHR WICHTIG!)

**MUSS HAVES**
- Burp Suite Pro (Web App Testing)
- Metasploit Framework (Network Exploitation)
- Nmap (Network Scanning)
- Kali Linux (Offensive Platform)
- Wireshark (Traffic Analysis)

**SOLLTE HAVES**
- Nessus (Vulnerability Scanning)
- sqlmap (SQL Injection Automation)
- Responder (LLMNR Poisoning)
- CrackMapExec (Active Directory)
- Certify (AD Certificate Services)
- impacket (Network Tools)
- Burp Extensions (custom automations)

**CLOUD-SPEZIFISCH**
- AWS CLI & Pacu (AWS Exploitation)
- Azure CLI (Azure Testing)
- gcloud CLI (GCP Testing)
- Scout Suite (Cloud Configuration Assessment)

### 2.4 Soft Skills (Underrated aber Critical!)

- **Technical Report Writing** (Clients zahlen für gute Reports!)
- **Executive Communication** (Non-technical stakeholders)
- **Problem Solving & Critical Thinking**
- **Documentation & Methodology** (NIST, OWASP, MITRE ATT&CK)
- **Attention to Detail**
- **Time Management** (Engagements sind oft zeitgebunden)

---

## 3. PORTFOLIO-PROJEKTE (KONKRETE BEISPIELE)

### 3.1 KATEGORIE A: Vulnerability Scanners & Recon Tools (GitHub)

**Projekt 1: Custom Vulnerability Scanner in Python**
```
Beschreibung:
- Modular aufgebauter Scanner für spezifische Vulnerabilities
- Input: Target IP/URL, Output: Vulnerability Report
- Demonstriert: Python Skills, Security Knowledge, Tool Development

Showcase-Elemente:
- README mit Setup Instructions
- Example Scans & Output
- Remediation Recommendations
- Code Comments & Best Practices
```

**Projekt 2: Active Directory Reconnaissance Framework**
```
Beschreibung:
- Tool zur AD-Enumeration & Exploitation
- Automatisiert häufige AD-Angriffsszenarien
- Output: Readable Attack Chains & Exploitation Paths

Showcase-Elemente:
- Dokumentation der AD Angriffsszenarien
- Screenshots der Enumeration
- Privilege Escalation Chains
- Remediation Steps
```

**Projekt 3: Cloud Misconfiguration Detector**
```
Beschreibung:
- Scannt AWS/Azure/GCP auf häufige Misconfigurations
- Priorisiert Findings by Risk Level
- Output: Executive Summary + Technical Details

Showcase-Elemente:
- Erklärung der Cloud Security Best Practices
- Real-World Examples
- Fix Recommendations
```

### 3.2 KATEGORIE B: Hands-On Lab Projects

**Projekt 1: Home Lab Penetration Test Report**
```
Struktur:
1. Executive Summary (1-2 Seiten)
   - Objectives, Scope, Key Findings
   - Overall Risk Posture

2. Detailed Findings (5-10 Findings)
   - Vulnerability ID & Name
   - Severity (CVSS Score)
   - Affected Assets
   - Exploitation Details & POC
   - Remediation Recommendations

3. Methodology
   - Tools Used
   - Techniques Applied
   - Attack Chain Documentation

4. Appendices
   - Screenshots & Evidence
   - Network Diagrams
   - Tool Output
   - MITRE ATT&CK Mapping
```

**Projekt 2: Web Application Security Assessment**
```
Target: Vulnerable Web App (DVWA, OWASP Juice Shop, WebGoat)
Dokumentation:
- Discovered Vulnerabilities (SQL Injection, XSS, IDOR, etc.)
- Exploitation POCs
- Business Impact Assessment
- Remediation Roadmap
- Screenshots & Video Walkthroughs
```

**Projekt 3: Active Directory Lab Exploitation**
```
Scenario:
- Build small AD Lab (Domain, Users, Computers, Domain Trusts)
- Perform Full Attack Chain
- Achieve Domain Administrator

Documentation:
- Enumeration Walkthrough
- Exploitation Techniques (Kerberoasting, etc.)
- Privilege Escalation Methods
- Lateral Movement Tactics
- Detection Evasion Techniques
```

### 3.3 KATEGORIE C: CTF Write-Ups & Bug Bounty Reports

**CTF Write-Up Template:**
```
Challenge: [Name]
Platform: [HackTheBox, TryHackMe, CTFtime, etc.]
Difficulty: [Easy/Medium/Hard]

Walkthrough:
1. Reconnaissance & Information Gathering
2. Scanning & Enumeration
3. Vulnerability Identification
4. Exploitation & Proof-of-Concept
5. Post-Exploitation & Cleanup

Tools Used: [List Tools]
Key Learnings: [What you learned]
Challenges Faced: [Problems & Solutions]
```

**Bug Bounty Report (Sanitized):**
```
Title: [Vulnerability Type]
Platform: [HackerOne, Bugcrowd, etc.]
Severity: [Critical/High/Medium/Low]

Summary:
- Clear description of vulnerability
- Impact Assessment
- Affected Systems/URLs
- Proof-of-Concept (with screenshots)
- Remediation Steps
- Timeline & Resolution
```

---

## 4. ZERTIFIZIERUNGEN & VALIDIERUNG

### 4.1 ENTRY-LEVEL CERTIFICATIONS (für Anfänger)

- **eJPT** (eLearnSecurity Junior Penetration Tester)
  - Duration: 2-4 weeks
  - Cost: $~200
  - Value: Entry-level validation

- **CompTIA Security+**
  - Duration: 4-6 weeks
  - Cost: $~400
  - Value: Industry-recognized baseline

- **CEH** (Certified Ethical Hacker)
  - Duration: 6-8 weeks
  - Cost: $~1000
  - Value: Broad knowledge validation

### 4.2 INTERMEDIATE CERTIFICATIONS (Praktikum-fokussiert)

- **PNPT** (Practical Network Penetration Tester)
  - Duration: 7-8 weeks
  - Cost: $~500
  - Value: Very practical, report writing focused
  - **Pro**: Industry employers recognize it, focuses on real pentest lifecycle
  - **Best for**: Portfolio building

- **PenTest+**
  - Duration: 6-8 weeks
  - Cost: $~400
  - Value: Strong practical component

### 4.3 ADVANCED CERTIFICATIONS (Für Profis)

- **OSCP** (Offensive Security Certified Professional)
  - Duration: 8-12 weeks
  - Cost: $~1000
  - Value: Gold standard in pentest industry
  - Prerequisites: 1-2 years security experience

- **GPEN** (GIAC Penetration Tester)
  - Duration: SANS SEC504 Course (Expensive!)
  - Cost: $~8000
  - Value: Government & Enterprise recognition

---

## 5. PORTFOLIO STRUCTURE & PRÄSENTATION

### 5.1 Empfohlene Struktur

```
GitHub Portfolio:
├── README.md (Professional Overview)
├── /Penetration-Testing-Reports
│   ├── Lab-Assessment-Report-v1.pdf
│   ├── DVWA-Assessment-Report.pdf
│   └── Home-Lab-Full-PT-Report.pdf
├── /Tools-Scripts
│   ├── vulnerability-scanner/
│   ├── ad-enumeration-framework/
│   └── cloud-misconfiguration-detector/
├── /CTF-WriteUps
│   ├── HackTheBox-Writeups.md
│   └── TryHackMe-Writeups.md
├── /Bug-Bounty-Reports
│   └── Sanitized-Security-Findings.md
├── /Lab-Documentation
│   ├── Home-Lab-Setup.md
│   ├── AD-Attack-Chains.md
│   └── Cloud-Testing-Scenarios.md
└── /Certifications
    └── Certificates-&-Badges.md
```

### 5.2 Personal Website/Portfolio

Empfohlen: **Einfache, professionelle Website** (nicht zu überdesigned)

```
Homepage:
- Professional Photo
- "About Me" (2-3 Sätze)
- Key Skills & Tools
- Featured Projects

Projects Page:
- 3-5 Flagship Projects (mit Screenshots)
- Each with: Description, Tools, Skills, Key Learnings

Blog/Write-Ups:
- CTF Walkthroughs
- Security Research
- Tool Tutorials
- Learning Journey

Contact:
- LinkedIn
- GitHub
- Email
```

### 5.3 LinkedIn Optimization

- **Headline**: "Penetration Tester | Red Team Operator | Active Directory Specialist | Python Developer"
- **Skills Section**: Add all relevant skills
- **Recommendations**: Get recommendations from colleagues
- **Content**: Share CTF write-ups, security insights
- **Featured**: Pin best GitHub projects

---

## 6. BEWERBUNGSSTRATEGIE

### 6.1 Qualifikationen für verschiedene Rollen

**Junior Penetration Tester (Entry-Level)**
- Minimalanforderungen:
  - OSCP, PNPT, eJPT, oder CEH
  - Hands-on experience (Home Lab)
  - Portfolio mit 2-3 Projects
  - 0-2 Jahre Security Experience

**Mid-Level Penetration Tester (3-5 Jahre)**
- Erwartungen:
  - OSCP + PNPT (oder ähnlich)
  - Mehrere real-world engagements
  - Specialization (Web/Network/Cloud/AD)
  - Strong report writing
  - €52.400 - €59.400/Jahr

**Senior/Lead Red Teamer**
- Anforderungen:
  - 5+ Jahre Pentest Experience
  - Multiple Advanced Certifications
  - Führungserfahrung
  - Advanced exploitation skills
  - €61.100+/Jahr

### 6.2 Jobsuche & Networking

**Remote Opportunities**:
- Mandiant (Red Team - Remote Germany Position exists!)
- Pentera
- eLearnSecurity
- CREST-certified firms
- Tier-1 Consulting Firms

**German Job Boards**:
- LinkedIn.com
- StepStone.de
- Indeed.de
- Xing.de

---

## 7. KONKRETE AKTIONSSCHRITTE (90-TAGE-PLAN)

### PHASE 1: Weeks 1-4 (Foundation)
- [ ] Setup Home Lab (VirtualBox, Kali, Target VMs)
- [ ] Install & Master Burp Suite, Metasploit, Nmap
- [ ] Complete 2-3 CTFs on HackTheBox oder TryHackMe
- [ ] Document findings in GitHub (even drafts!)

### PHASE 2: Weeks 5-8 (Building Projects)
- [ ] Create first vulnerability scanner (Python)
- [ ] Complete first full penetration test (Home Lab)
- [ ] Write detailed PT Report (Professional Format)
- [ ] Create 3-5 CTF Write-Ups

### PHASE 3: Weeks 9-12 (Portfolio Polish)
- [ ] Create GitHub Portfolio (professional README)
- [ ] Build simple portfolio website
- [ ] Get 1-2 certifications (PNPT oder eJPT)
- [ ] Optimize LinkedIn profile
- [ ] Create 3-5 bug bounty reports (real or simulated)

### PHASE 4: Ongoing (Maintenance)
- [ ] Weekly CTF challenge
- [ ] Monthly blog post/writeup
- [ ] Quarterly skill update
- [ ] Active job applications

---

## 8. HÄUFIGE FEHLER (VERMEIDEN!)

❌ **Unsanitized Real Data in Reports**
- Immer Client Names, IPs, sensitiv data anonymisieren
- Verwende "XXX.XXX.XXX.0/24" statt echter IPs

❌ **Zu viele Small Trivial Projects**
- Besser: 3-5 tiefe, komplexe Projekte
- Statt: 20 einfache "Hello World" Projekte

❌ **Keine Dokumentation**
- Screenshots sind wichtig
- Erklare WARUM, nicht nur WAS
- Business Impact immer einbeziehen

❌ **Nur Offensive Skills**
- Zeige auch: Remediation, Reporting, Recommendations
- Beweise du kannst mit Clients kommunizieren

❌ **Outdated Tools & Techniques**
- 2026 ist nicht 2020!
- Update dein Portfolio regelmäßig

---

## 9. SICHTBARKEITSOPTIMIERUNG

### SEO für dein GitHub
- README mit Keywords
- Clear, descriptive commit messages
- Topics Tags
- README Badges (Certifications, Languages)

### Community Engagement
- Participate in CTF competitions
- Contribute to open-source security projects
- Share writeups on Medium/Dev.to
- Engage with security Twitter/X community
- Answer questions on Reddit r/cybersecurity

---

## 10. EMPFOHLENE RESSOURCEN & PLATTFORMEN

### Learning Platforms
- TryHackMe.com
- HackTheBox.com
- PentesterLab.com
- Udemy (specific pentesting courses)
- eLearnSecurity Academy

### Bug Bounty Programs
- HackerOne.com
- Bugcrowd.com
- Intigriti.io
- YesWeHack.com

### Tools & Frameworks
- Kali Linux (offensive OS)
- Burp Suite Community/Pro
- Metasploit Framework
- OWASP Juice Shop (vulnerable web app)
- Metasploitable (vulnerable Linux)

### Documentation
- OWASP Top 10 (2021)
- MITRE ATT&CK Framework
- NIST Cybersecurity Framework
- CWE Top 25

---

## FAZIT

Ein starkes Penetration Testing Portfolio ist dein **Eintrittskarte** in diese lukrative Branche. Mit dem richtigen Mix aus:

1. ✅ **Praktischen Projekten** (GitHub)
2. ✅ **Professionellen Reports** (Real-World Simulation)
3. ✅ **Zertifizierungen** (Industry Validation)
4. ✅ **Community Engagement** (Visibility)
5. ✅ **Kontinuierlichem Lernen** (90-Day Plan)

...kannst du innerhalb von 3-6 Monaten ein Portfolio aufbauen, das Arbeitgeber beeindruckt und dir Positionen mit €50.000+ Gehalt verschafft.

**Die Branche wächst mit 18,7% CAGR - Es ist der richtige Zeitpunkt, um einzusteigen!**

---

*Dieses Dokument basiert auf aktuellen Marktdaten von Januar 2026*
*Zuletzt aktualisiert: 02.01.2026*