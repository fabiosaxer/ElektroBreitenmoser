# QA- & Accessibility-Prüfbericht — Elektro Breitenmoser AG Website

Geprüft: `src/pages/*.astro`, `src/components/*.astro`, `src/layouts/Layout.astro`, `src/styles/global.css`, `src/data/appliances.ts`. Methodik: statische Codeanalyse, `npm run build` (Astro/Vite), Prüfung des generierten `dist/`-Outputs, sowie rechnerische WCAG-Kontrastprüfung (relative Luminanz nach WCAG-Formel) inkl. Pixel-Sampling des Hero-Fotos (`hero-standort.jpg`) mit Pillow, um das Overlay-Verhalten über realen Bildbereichen zu verifizieren.

`npm run build` läuft **fehlerfrei durch** (5 Seiten, keine Fehler/Warnungen). Alle internen `href`-Ziele (`/`, `/ueber-uns`, `/geraeteanfrage`, `/impressum`, `/datenschutz`) existieren als Seiten. Jede Seite hat genau ein `<h1>`. Keine `ß`-Verwendung (korrekt für CH-Konvention). Alle Bilder haben inhaltlich sinnvolle, spezifische Alt-Texte (keine Generika wie „Bild1“); dekorative SVG-Icons sind überwiegend korrekt mit `aria-hidden="true"` versehen. Formularfelder in `geraeteanfrage.astro` haben durchgängig korrekt zugeordnete `<label for>`/`id`-Paare.

---

## Kritisch

### 1. Formular-Endpoint ist ein Platzhalter — Formular ist funktionsunfähig
**Fundort:** `src/pages/geraeteanfrage.astro:6` — `const formEndpoint = 'https://formspree.io/f/REPLACE_ME';` (mit TODO-Kommentar)
**Beschreibung:** Das Kontaktformular sendet an eine nicht existierende URL. Ein Nutzer, der „Anfrage senden“ klickt, erhält einen Fehler bzw. die Anfrage geht verloren. Dies ist der zentrale Conversion-Pfad der Seite.
**Korrektur:** Vor Go-Live echten Formspree-/Web3Forms-Endpoint eintragen, erfolgreich testen (inkl. Redirect/Erfolgsmeldung) und eine sichtbare Erfolgs-/Fehlermeldung mit `aria-live="polite"` ergänzen, da aktuell keinerlei Feedback nach Absenden vorgesehen ist.

### 2. Hero-Overlay: weisser Text fällt in hellen Bildbereichen unter 4.5:1 (teils unter 3:1)
**Fundort:** `src/pages/index.astro:54` — `bg-gradient-to-t from-vzug/85 via-vzug/50 to-vzug/20`, Text in `index.astro:56-77`
**Beschreibung:** Rechnerisch geprüft (WCAG-Kontrastformel, Overlay-Farbe `#14328c` über realen Pixelwerten aus `hero-standort.jpg`):
- Am oberen Rand des Verlaufs (`to-vzug/20`, nur 20% Deckung) ergeben sich über hellen Bildpartien (z. B. Himmel: RGB ~141/181/234) nur **2.83:1** Kontrast zu Weiss — selbst für den grossen H1 (benötigt 3:1) zu wenig; über hellem Untergrund/Fassade (~140/147/95) **4.19–4.22:1** — unter dem 4.5:1-Minimum für den Fliesstext (Subtitle `text-lg`, 18px ohne Fettschrift zählt **nicht** als „large text“ nach WCAG-Definition, die 18.66px+bold bzw. 24px verlangt).
- Selbst die mittlere Stufe (`via-vzug/50`) liegt über sehr hellen Bildstellen nur knapp bei 4.63:1.
Da der Hero-Text vertikal zentriert ist (`flex items-center`, `absolute inset-0`) und die Bildausschnitt-Position je nach Viewport-Breite variiert (object-cover schneidet bei schmalen/mobilen Viewports weniger vertikal ab, wodurch hellere Bildbereiche wie Himmel sichtbarer werden), ist ein Kontrastverstoss real möglich, nicht nur theoretisch.
**Korrektur:** Minimale Overlay-Deckung nicht unter ca. 45–50% fallen lassen (z. B. `from-vzug/90 via-vzug/70 to-vzug/50`), alternativ eine gleichmässige Basis-Abdunkelung (`bg-vzug/40`) zusätzlich zum Gradient legen oder Text mit `drop-shadow`/Textschatten zusätzlich absichern.

### 3. `text-accent` (#0aa0c8) auf Weiss unterschreitet WCAG-AA-Kontrast
**Fundort:** `src/pages/index.astro:301` — Link „Rezepte entdecken“ (`text-sm font-semibold text-accent hover:text-accent-dark`)
**Beschreibung:** Berechneter Kontrast Weiss/`#0aa0c8` = **3.05:1**. Erforderlich für Normaltext: 4.5:1. `text-sm` (14px) mit `font-semibold` zählt nicht als „large text“, daher eindeutiger AA-Verstoss.
**Korrektur:** `text-accent-dark` (#087f9e, 4.63:1 — knapp AA-konform) statt `text-accent` für Textfarben auf Weiss verwenden, oder Accent-Farbe global etwas abdunkeln.

---

## Wichtig

### 4. Mobile-Menü-Button: `aria-label` wird nicht mit dem Zustand aktualisiert
**Fundort:** `src/components/Header.astro:37-42` (statisch `aria-label="Menü öffnen"`), Click-Handler `Header.astro:106-112`
**Beschreibung:** `aria-expanded` wird korrekt umgeschaltet, das `aria-label` bleibt aber dauerhaft „Menü öffnen“, auch wenn das Menü bereits offen ist — widersprüchliche Ansage für Screenreader-Nutzer.
**Korrektur:** Im Click-Handler `button.setAttribute('aria-label', isOpen ? 'Menü schliessen' : 'Menü öffnen')` ergänzen.

### 5. Touch-Targets unter empfohlenen 44×44px
**Fundort:** `Header.astro:43` (`h-9 w-9` = 36×36px Button), mobile Nav-Links `Header.astro:80-96` (`py-2`, ~36px Höhe)
**Beschreibung:** Mehrere interaktive Elemente im mobilen Header unterschreiten die im Prüfauftrag geforderte Mindestgrösse von ~44×44px.
**Korrektur:** Button auf `h-11 w-11`, Nav-Links auf `py-3` anheben.

### 6. Keine `aria-current="page"` für aktive Navigation
**Fundort:** `Header.astro:19-27` (Desktop-Nav) und `:80-88` (Mobile-Nav) — aktive Seite wird nur farblich (`text-brand`) markiert
**Beschreibung:** Screenreader-Nutzer erkennen die aktuell aktive Seite nicht, da nur visuell per Farbe unterschieden wird (Farbe allein als einziges Unterscheidungsmerkmal ist zudem grenzwertig zu WCAG 1.4.1).
**Korrektur:** `aria-current={currentPath === item.href ? 'page' : undefined}` auf den jeweiligen Links ergänzen.

### 7. Hero-Bild (LCP) wird mit `loading="lazy"` ausgeliefert
**Fundort:** `src/pages/index.astro:47-53` (`<Image>` ohne `loading`/`fetchpriority`-Prop); bestätigt im Build-Output `dist/index.html`: `loading="lazy" decoding="async"`
**Beschreibung:** Das Hero-Bild ist Above-the-Fold und mit hoher Wahrscheinlichkeit das Largest-Contentful-Paint-Element. `loading="lazy"` verzögert dessen Laden unnötig und verschlechtert LCP/Ladeperformance.
**Korrektur:** `loading="eager" fetchpriority="high"` explizit auf dem Hero-`<Image>` setzen.

### 8. Placeholder-/TODO-Inhalte sind live im Code vorhanden
**Fundort:** `src/pages/datenschutz.astro:8-12` (nur TODO-Platzhaltertext statt Datenschutzerklärung), `src/pages/ueber-uns.astro:9-14` (Firmengeschichte mit `19XX`/`20XX`-Platzhaltern)
**Beschreibung:** Rechtlich (Datenschutzerklärung ohne echten Inhalt trotz aktivem Formular, das personenbezogene Daten sammelt) und inhaltlich nicht launch-fähig.
**Korrektur:** Vor Go-Live durch finale Inhalte ersetzen; Datenschutztext muss den tatsächlichen Formular-Anbieter (siehe Punkt 1) benennen.

### 9. Dekorative Menü-Icons ohne `aria-hidden`
**Fundort:** `Header.astro:45-58` (`#icon-open`) und `:59-71` (`#icon-close`) — im Gegensatz zu allen übrigen SVGs im Projekt fehlt hier `aria-hidden="true"`
**Korrektur:** `aria-hidden="true"` ergänzen; der Button trägt bereits ein eigenes `aria-label`, die Icons sollen nicht zusätzlich vorgelesen werden.

---

## Nice-to-have

### 10. Footer nutzt vier `<h2>` für reine Rubriken-Titel
**Fundort:** `src/components/Footer.astro:8,15,28,35`
**Beschreibung:** In Kombination mit den Seiten-eigenen `h2`-Elementen entsteht eine sehr flache/unübersichtliche Dokumentgliederung (Footer erscheint auf jeder Seite und fügt 4 weitere „Sektionen“ auf `h2`-Ebene hinzu).
**Korrektur:** Auf `h3` wechseln oder als visuell gestaltete `<p>`-Labels mit umgebendem `<nav aria-label="…">` realisieren.

### 11. Fokus-Ring der Formularfelder sehr dünn
**Fundort:** `geraeteanfrage.astro` — `focus:outline-none focus:ring-1 focus:ring-brand` (alle Inputs/Select/Textarea)
**Beschreibung:** Sichtbar, aber knapp; robustere Erkennbarkeit wünschenswert.
**Korrektur:** `focus:ring-2` statt `focus:ring-1`.

### 12. Generierte WebP-Kacheln für Showroom-Grid ungewöhnlich gross
**Fundort:** Build-Output `dist/_astro/showroom-*.webp`, 800w-Variante zwischen ~620–900 KB, obwohl im Layout (`index.astro:193-210`) nur als ca. 200–400px breite Quadrat-Kachel dargestellt.
**Korrektur:** Astro-`quality`-Parameter reduzieren oder maximale `widths`-Stufe passend zur tatsächlichen Anzeigegrösse senken.

### 13. Ungenutzte, sehr grosse Bild-Assets im Repo
**Fundort:** `src/assets/images/servicefahrzeug-idbuzz.jpg` (3.6 MB), `symbolbild-lieferung.jpg` (1.9 MB) — in keiner `.astro`-Datei referenziert.
**Beschreibung:** Kein Live-Performance-Impact (nicht im Build enthalten), aber Repo-Hygiene/spätere Verwechslungsgefahr.

### 14. Pflichtfelder im Formular nicht visuell gekennzeichnet
**Fundort:** `src/pages/geraeteanfrage.astro` — nur das Telefonfeld trägt „(optional)“, die Pflicht der übrigen Felder wird nicht explizit kommuniziert.
**Korrektur:** Sichtbaren Hinweis „* Pflichtfeld“ ergänzen (kognitive Zugänglichkeit, klareres Erwartungsmanagement vor Absenden).

---

## Zusammenfassung
- **Kritisch:** 3
- **Wichtig:** 6
- **Nice-to-have:** 5
