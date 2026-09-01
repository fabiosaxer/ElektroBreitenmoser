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

### Domain

Hauptdomain: **vzugshop.ch** (in `astro.config.mjs` als `site` hinterlegt,
steuert Canonical-Tags, JSON-LD, `sitemap.xml`, `robots.txt`).

`elektrobreitenmoser.ch` und `vzug-spezialist.ch` sollen ebenfalls auf diese
Seite zeigen. Das ist reine Domain-/DNS-Konfiguration beim jeweiligen
Registrar bzw. in Plesk, keine Code-Änderung: Diese Domains als **301-Redirect
auf `vzugshop.ch`** einrichten (nicht als eigenständig gehostete Kopie – sonst
sieht Google drei Websites mit identischem Inhalt statt einer, was dem
Ranking schadet).

## Kontaktformular (Web3Forms)

Das Formular auf `/geraeteanfrage` sendet per reinem HTML-POST direkt an
`https://api.web3forms.com/submit` – es ist noch kein echter Access Key
hinterlegt (`src/pages/geraeteanfrage.astro`, Konstante `web3formsAccessKey =
'REPLACE_ME'`).

### Access Key einrichten (einmalig, ca. 2 Minuten)

1. https://web3forms.com öffnen.
2. Im Feld "Enter your Email Address" **info@vzugshop.ch** eintragen und auf
   "Create Access Key" klicken. Es ist **kein Account/Login** nötig – der Key
   wird direkt angezeigt und zusätzlich per E-Mail an info@vzugshop.ch
   geschickt (Postfach dafür griffbereit haben, z. B. im M365-Webmail).
3. Die Bestätigungsmail von Web3Forms an info@vzugshop.ch öffnen und den
   Bestätigungslink anklicken – **erst danach werden Formulareinsendungen
   tatsächlich zugestellt.**
4. Den angezeigten Access Key (Format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
   kopieren und in `src/pages/geraeteanfrage.astro` eintragen:
   ```ts
   const web3formsAccessKey = 'HIER-DEN-ECHTEN-KEY-EINFÜGEN';
   ```
5. Committen, pushen, warten bis GitHub Actions den `dist`-Branch aktualisiert
   hat, dann auf der Live-Seite eine Testanfrage über das Formular senden und
   prüfen, ob die Mail bei info@vzugshop.ch ankommt (ggf. auch im Spam-Ordner
   nachschauen – bei der allerersten Zustellung nicht unüblich).

Der Access Key ist **kein Geheimnis** – er darf im Frontend-Code sichtbar
sein, das ist bei Web3Forms so vorgesehen (er erlaubt nur das Einsenden von
Formularen an das eigene, verifizierte Postfach, keinen beliebigen Versand).

Spam-Schutz: Das Formular enthält bereits ein verstecktes Honeypot-Feld
(`botcheck`), das Web3Forms automatisch als Bot-Filter auswertet – ohne
Zusatzkonfiguration nötig. Bei Bedarf lässt sich im Web3Forms-Dashboard
zusätzlich reCAPTCHA aktivieren.

### E-Mail-Zustellung und Microsoft 365

info@vzugshop.ch ist bei M365 gehostet. Mit obigem Setup **empfängt** dieses
Postfach die Formular-Mails ganz normal (Web3Forms versendet sie an die
verifizierte Adresse) – dafür ist nichts Weiteres in M365 einzurichten.

Falls stattdessen der **Versand selbst** technisch über M365 laufen soll
(z. B. aus Branding-/Deliverability-Gründen, damit die Mail "von" der
eigenen Domain über den eigenen Mailserver kommt statt über Web3Forms'
Infrastruktur), braucht es einen zusätzlichen, rein M365-seitigen Schritt,
den nur der Tenant-Admin einrichten kann (kein Code-/Repo-Änderung):

1. In [Power Automate](https://make.powerautomate.com) (in den meisten
   Business-M365-Plänen enthalten) einen neuen Flow anlegen: Trigger
   "Wenn eine HTTP-Anfrage empfangen wird".
2. Als Aktion "E-Mail senden (V2)" aus dem Office-365-Outlook-Connector
   hinzufügen, authentifiziert als info@vzugshop.ch.
3. Die vom Trigger generierte URL anschliessend anstelle von
   `https://api.web3forms.com/submit` als `action` im Formular eintragen
   (und die Formularfelder im Flow entsprechend im Mailtext verwenden).
4. Spam-/Bot-Schutz (Honeypot) müsste dann selbst im Flow geprüft werden, da
   Web3Forms in diesem Fall nicht mehr dazwischenhängt.

Das ist optional und deutlich aufwändiger als die Web3Forms-Variante – für
den Start empfiehlt sich, mit Web3Forms zu launchen und diesen Schritt bei
Bedarf später nachzuziehen.

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
