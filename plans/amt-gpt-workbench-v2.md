# Amt-GPT Workbench V2 - Implementation Plan

## Overview

Upgrade the basic Amt-GPT simulator to a full 4-tab workbench that properly presents the 8,500-word research dossier with "Nüchterne Investigativ-Satire" tone.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  🏛️ Amt-GPT Workbench                              [X]     │
├─────────────────────────────────────────────────────────────┤
│  [📊 Dashboard] [📚 Research] [🤖 Simulator] [💬 Chat]     │
├─────────────────────────────────────────────────────────────┤
│                    Tab Content Area                         │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/components/AmtGPT/
├── index.ts                     # Updated exports
├── types.ts                     # Extended types
├── data.ts                      # Keep existing
├── dashboardData.ts             # NEW: Dashboard metrics
├── researchData.ts              # NEW: Dossier content
├── enhancedProblems.ts          # NEW: Problems with personas
├── AmtGPTWorkbench.tsx          # NEW: Main container
├── tabs/
│   ├── DashboardTab.tsx         # NEW: Metrics & charts
│   ├── ResearchTab.tsx          # NEW: Dossier presentation
│   ├── SimulatorTab.tsx         # Improved from existing
│   └── ChatTab.tsx              # NEW: AI chat integration
├── AmtGPTModal.tsx              # Updated to use workbench
├── AmtGPTPreview.tsx            # Keep as is
└── AmtGPT.css                   # Extended styles
```

## Implementation Steps

### Phase 1: Data Files

1. **dashboardData.ts**
   - Burden index (radar chart data)
   - Comparison data (BA vs Modern)
   - Key stats with sources

2. **researchData.ts**
   - Architecture diagram (ASCII)
   - Administrative Burden Framework
   - Error gallery
   - User quotes/metaphors
   - COBOL code snippet

3. **enhancedProblems.ts**
   - Extend existing problems with:
     - Persona (name, context)
     - Story narrative
     - Modern alternative
     - Affected groups

### Phase 2: Tab Components

1. **DashboardTab.tsx**
   - Radar chart (recharts)
   - 4-grid key metrics
   - Comparison bar chart
   - Trustpilot score

2. **ResearchTab.tsx**
   - Scrollable article layout
   - "Frankenstein-Stack" ASCII diagram
   - Administrative Burden visualization
   - Error accordion
   - Sources section

3. **SimulatorTab.tsx**
   - Improved from existing
   - Persona/story context
   - Modern alternative comparison
   - Better UI cards

4. **ChatTab.tsx**
   - Amt-GPT system prompt
   - Chat interface
   - Suggested questions

### Phase 3: Main Workbench

1. **AmtGPTWorkbench.tsx**
   - Tab navigation with Framer Motion
   - Active tab state management
   - Responsive design

### Phase 4: Integration

1. **Update types.ts** - Extended interfaces
2. **Update AmtGPTModal.tsx** - Use workbench, larger modal
3. **Extend AmtGPT.css** - New tab styles
4. **Update index.ts** - New exports

## Acceptance Criteria

- [ ] 4 tabs work with smooth transitions
- [ ] Dashboard shows Radar chart + metrics + comparison
- [ ] Research tab presents dossier content readably
- [ ] Simulator has persona stories
- [ ] Chat tab works with Amt-GPT persona
- [ ] Tone is nüchtern-satirisch (informative satire, not doom)
- [ ] Responsive on mobile
- [ ] No TypeScript errors

## Tone Guidelines

**"Nüchterne Investigativ-Satire"**
- Informative with dry humor
- Like well-researched journalism with satirical elements
- Not apocalyptic, not trivializing
- Let the facts speak for themselves

## Key Data Points to Highlight

- 60% non-take-up rate (Grundsicherung)
- 40+ years COBOL legacy
- 5 min session timeout
- 2 MB upload limit
- 24-48h sync delay
- Trustpilot 1.2/5 stars