# Elektro Breitenmoser AG – Website

Neue Website für die Elektro Breitenmoser AG (V-ZUG Fachhändler, Marbach), als
Ablösung des bestehenden WordPress-Prototyps (https://vzugeb.saxer.sg).

Anforderungen und offene Punkte: siehe [ANFORDERUNGEN.md](./ANFORDERUNGEN.md).

## Tech-Stack

- [Astro](https://astro.build) (statischer Seitengenerator)
- [Tailwind CSS](https://tailwindcss.com)
- TypeScript

## Projektstruktur

```text
/
├── src/
│   ├── layouts/Layout.astro    # Grundgerüst (Head, Header, Footer)
│   ├── components/             # Header, Footer, wiederverwendbare Bausteine
│   └── pages/                  # Start, Über uns, Geräteanfrage, Impressum, Datenschutz
├── public/                     # Statische Assets (Bilder, Favicon)
└── .github/workflows/deploy.yml
```

## Entwicklung

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # Production-Build nach ./dist
npm run preview   # Build lokal testen
```

## Deployment

Bei jedem Push auf `main` baut GitHub Actions (`.github/workflows/deploy.yml`)
die statische Seite und veröffentlicht das Ergebnis im Branch `dist`. Plesk
(Hosttime) bindet diesen Branch per Git-Integration ein und dient ihn direkt
als Document Root aus – auf dem Produktivserver ist kein Node.js/Build-Schritt
nötig.

## Kontaktformular

Die Seite `/geraeteanfrage` sendet aktuell an einen Platzhalter-Endpoint
(`src/pages/geraeteanfrage.astro`). Sobald ein Formspree- oder
Web3Forms-Account existiert, den echten Endpoint dort eintragen.

## Subagenten (`.claude/agents/`)

Für die Weiterentwicklung dieser Website stehen 9 spezialisierte Claude-Code-Subagenten zur Verfügung:

| Agent | Zuständigkeit |
| --- | --- |
| `research-agent` | Recherchiert Unternehmen, Produkt, Branche, Zielgruppe und Wettbewerber als Grundlage für Content und SEO. |
| `ui-ux-designer` | Entwirft Layout, Wireframes, Design-System (Farben, Typo, Spacing) vor der Code-Umsetzung. |
| `content-writer` | Schreibt Website-Texte (Headlines, Fließtext, CTAs) basierend auf Research und Design. |
| `frontend-developer` | Setzt Design-Spezifikation und Texte in Code um (HTML/CSS/JS bzw. das jeweilige Framework). |
| `seo-specialist` | Optimiert Meta-Tags, strukturierte Daten, Seitenstruktur und interne Verlinkung. |
| `critical-reviewer` | Prüft Ergebnisse der anderen Agenten kritisch, bevor sie als final gelten. |
| `qa-accessibility-tester` | Testet die fertige Seite auf Funktionsfehler, Responsive-Probleme und WCAG-Barrierefreiheit. |
| `security-engineer` | Prüft auf Sicherheitslücken (Header, Input-Validierung, Formulare, Abhängigkeiten) und schlägt Härtung vor. |
| `deployment-engineer` | Bereitet Build- und Deployment-Konfiguration vor (CI/CD, Hosting-Setup). |

**Wichtig:** `critical-reviewer` ist kein einmaliger Schritt am Ende, sondern ein
wiederkehrendes Qualitäts-Gate, das nach `research-agent`, `ui-ux-designer`,
`content-writer` und `seo-specialist` jeweils erneut eingesetzt wird, bevor mit
deren Ergebnis weitergearbeitet wird.

**Typischer Ablauf:**

```
research-agent → (critical-reviewer)
  → ui-ux-designer → (critical-reviewer)
  → content-writer → (critical-reviewer)
  → frontend-developer
  → seo-specialist → (critical-reviewer)
  → qa-accessibility-tester
  → security-engineer
  → deployment-engineer
```
