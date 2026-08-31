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
│   └── pages/                  # Start, Inspiration, Geräteanfrage, Impressum, Datenschutz
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
