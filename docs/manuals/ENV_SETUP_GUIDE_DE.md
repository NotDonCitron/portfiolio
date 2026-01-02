# 📋 Environment Setup Guide

## ✅ **Was ich erstellt habe:**

### **1. .env.example Datei**
- Vollständige Vorlage für alle Environment-Variablen
- Mit allen Erklärungen für jeden Parameter
- Organisiert nach Kategorien (Frontend, Backend, HF API, etc.)

### **2. .gitignore aktualisiert**
- `.env` Dateien werden NICHT zu Git commited
- Zusätzlicher Schutz für Hugging Face Tokens

---

## 🚀 **So gehst du vor:**

### **Schritt 1: Hugging Face API Token holen**

1. **Gehe zu:** https://huggingface.co/settings/tokens
2. **Klicke auf:** "New Token" (Neuer Token)
3. **Name:** "Portfolio-Chatbot" (oder ähnlich)
4. **Typ:** "Read" (für Inference)
5. **Token kopieren** und sicher aufbewahren

⚠️ **WICHTIG: Token sofort kopieren - er wird nur EINMAL angezeigt!**

---

### **Schritt 2: .env Datei erstellen**

#### **Option A: Aus .env.example kopieren (Empfohlen)**

```bash
# .env.example in .env umbenennen
cp .env.example .env
```

#### **Option B: Manuel erstellen**

```bash
# Neue .env Datei erstellen
touch .env
```

---

### **Schritt 3: Token in .env einfügen**

Öffne die `.env` Datei und ersetze:

```bash
# ALT (Platzhalter)
VITE_HF_API_TOKEN=hf_your_token_here_replace_with_your_actual_token

# NEU (Dein echter Token)
VITE_HF_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Alle Token-Platzhalter ersetzen:**
- `hf_your_token_here_replace_with_your_actual_token`
- `your_random_secret_key_here_generate_long_random_string`
- `your_vercel_token_here`

---

### **Schritt 4: Entwicklungsserver starten**

```bash
# Abhängigkeiten installieren (falls noch nicht geschehen)
npm install

# Entwicklungsserver starten
npm run dev
```

---

## 📖 **Erklärung der wichtigsten Variablen:**

### **🤖 Hugging Face API Token (WICHTIG!)**

```bash
# Für Cloud Inference (Pro benefits nutzen)
VITE_HF_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Was es tut:**
- Ermöglicht Chatbot mit Cloud-Inference
- 20× mehr Credits als Free-Tier
- ZeroGPU Priorität (schneller)
- Keine Rate Limits

**Woher bekommst du es:**
- https://huggingface.co/settings/tokens

---

### **🤖 Chatbot Modell Konfiguration**

```bash
# Kleines, schnelles Modell (3B Parameter)
VITE_HF_CHAT_MODEL=HuggingFaceTB/SmolLM3-3B

# Alternative (größer, besser)
# VITE_HF_CHAT_MODEL=microsoft/Phi-3-mini-128k-instruct
```

---

### **🖼️ Vision Modell (Bildanalyse)**

```bash
# Florence-2 für Bildbeschreibungen
VITE_HF_VISION_MODEL=microsoft/Florence-2-base
```

**Was es tut:**
- Bilder analysieren
- Automatische Beschreibungen generieren
- Objekte erkennen
- OCR (Text in Bildern)

---

### **🔐 Backend-Sicherheit**

```bash
# Flask Secret Key (Backend schützen)
FLASK_SECRET_KEY=dein_langer_geheimer_string_hier_einfügen
```

**Erstelle einen sicheren Key:**
```bash
# Zufälligen String generieren (32 Zeichen Minimum)
openssl rand -base64 32
# oder
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

### **🚀 Feature Flags (Features ein/ausschalten)**

```bash
# Chatbot aktivieren/deaktivieren
VITE_ENABLE_AI_CHAT=true

# Bildanalyse aktivieren
VITE_ENABLE_IMAGE_ANALYSIS=true
```

---

## 🔒️ **SICHERHEITS-MASSNAHMEN:**

### ✅ **Getan:**
- [x] `.env` ist in `.gitignore` (kein Upload zu GitHub)
- [x] `.env.example` ist sicher (nur Platzhalter)
- [x] `.env` enthält echte Werte (nicht commited)

### ⚠️ **NICHT tun:**
- [ ] `.env` Datei zu GitHub commiten (VERBOTEN!)
- [ ] Token in Screenshots teilen
- [ ] Token in öffentlichen Repositories speichern
- [ ] `.env` Datei versenden

---

## 🧪 **Entwicklung vs Produktion:**

### **Entwicklung (.env.local):**
```bash
# Für lokale Entwicklung
.env.local
```

### **Produktion (.env.production):**
```bash
# Für Produktion
.env.production
```

---

## 📱 **Im Code verwenden:**

### **Frontend (Vite/React):**

```typescript
// Environment-Variablen importieren
const hfApiToken = import.meta.env.VITE_HF_API_TOKEN;
const chatModel = import.meta.env.VITE_HF_CHAT_MODEL;
const enableAIChat = import.meta.env.VITE_ENABLE_AI_CHAT;

// API-Aufruf
const response = await fetch('https://api-inference.huggingface.co/models/' + chatModel, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${hfApiToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ inputs: 'Hallo!' })
});
```

### **Backend (Python/FastAPI):**

```python
import os
from dotenv import load_dotenv

# Environment-Variablen laden
load_dotenv()

# Token holen
hf_token = os.getenv('HF_API_TOKEN')

# Model-Konfiguration
chat_model = os.getenv('HF_CHAT_MODEL')
vision_model = os.getenv('HF_VISION_MODEL')

# Verwendung
print(f"Chatbot verwendet: {chat_model}")
print(f"Vision-Modell: {vision_model}")
```

---

## 🚀 **Nächste Schritte:**

1. ✅ **Hugging Face Token erstellen** (oben beschrieben)
2. ✅ **`.env.example` nach `.env` kopieren**
3. ✅ **Token in `.env` einfügen**
4. ✅ **`npm run dev` starten**
5. ✅ **Chatbot implementieren** (Phase 3 des Plans)
6. ✅ **Mit Pro testen** (ZeroGPU, 20× Credits)

---

## 📞 **Hilfe:**

- **Token erstellen:** https://huggingface.co/settings/tokens
- **Dokumentation:** https://huggingface.co/docs/api-inference
- **Pro-Features:** https://huggingface.co/pricing
- **Probleme?** GitHub Issues erstellen

---

**Nach dem Einrichten bist du bereit für Phase 3 (Chatbot)!** 🚀
