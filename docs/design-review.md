# Kritisches Review: `docs/design-spec.md`

Stand: 31.08.2026. Geprüft gegen `docs/research.md` sowie den aktuellen Code
(`src/pages/index.astro`, `src/pages/ueber-uns.astro`, `src/pages/geraeteanfrage.astro`,
`src/components/Header.astro`, `src/components/Footer.astro`, `src/styles/global.css`).

## Grundsätzliche Einschätzung

Die Diagnose (Abschnitt 1) ist ungewöhnlich konkret und mit echten Codezeilen belegt – das
ist die Stärke des Dokuments. Die daraus abgeleiteten Massnahmen sind aber an mehreren
Stellen entweder unbegründete Geschmacksentscheidungen (allen voran die Serife), oder
enthalten offene "oder"-Formulierungen, die eigentlich Design-Entscheidungen sind und die
`frontend-developer` nicht selbst treffen sollte.

## Kritische Punkte

1. **Die Serifenschrift-Begründung ist eine Differenzierungs-, keine Zielgruppen-Begründung –
   und sie widerspricht sich selbst.**
   Das Argument lautet: Wettbewerber (Fust, Interdiscount, Weber, Hasler) seien alle
   Sans-Serif, also differenziert eine Serife. Das ist eine reine "anders als die anderen"-Logik,
   keine Ableitung aus `research.md` – dort steht nichts zu Typografie-Präferenzen der
   Zielgruppe, nur allgemein "konservativ, älter, Vertrauen wichtiger als Trend" und
   ausdrücklich "kein Jugend-/Trend-Slang". Zwei Gegenargumente, die die Spec nicht
   entkräftet: (a) V-ZUGs eigene Markenwelt und Schweizer Corporate-Design-Tradition sind
   klassisch sans-serif/nüchtern – eine Serife für Überschriften kann bei einem
   Elektrogeräte-Fachhändler eher wie Notariat/Bestattungsinstitut/Boutique-Café wirken als
   wie "Schweizer Technik-Qualität". (b) Serife-Revival ist selbst ein aktueller
   Editorial-/DTC-Designtrend (2020er) – für eine designaffine Person mag es Distinktion
   signalisieren, aber genau das ist die Zielgruppe laut Research explizit nicht ("eher
   traditionelle/ländliche Kundschaft", Vertrauen in Handwerk wichtiger als "trendiges
   Design"). Zusätzlich widerspricht sich die Spec selbst: Sie begründet die Font-Wahl mit
   "Beibehaltung von System-Fonts aus Performance-/Ladezeitgründen (keine
   Google-Fonts-Abhängigkeit nötig)" – und lädt im nächsten Satz trotzdem eine Google-Font
   (Source Serif 4) nach. Das Performance-Argument wird als Rahmen aufgebaut, dann für die
   eigentliche Entscheidung stillschweigend verlassen.
   **Verbesserungsvorschlag:** Diese Entscheidung braucht entweder eine echte Stütze (Beispiele
   traditioneller Schweizer Handwerks-/Familienbetriebe, die mit Serife erfolgreich
   "Kontinuität ohne trendig zu wirken" kommunizieren) oder sollte, wie andere unsichere
   Annahmen im Research-Dokument, explizit als offene Frage markiert und vor Umsetzung mit
   dem Kunden (Daniel Benz) oder per Mockup-Vergleich (Serife vs. kräftiger Sans mit
   Kicker-Element) geprüft werden – statt als "günstigste Massnahme mit grösstem
   Differenzierungseffekt" (Prio 1!) festgeschrieben zu werden.

2. **Mehrere Vorschläge sind nicht entscheidungsreif, sondern delegieren die eigentliche
   Design-Entscheidung an den `frontend-developer`.**
   - Footer: "eingebettetes, statisches Kartenvorschaubild **oder** Standort-Icon + Adresse" –
     zwei unterschiedliche UI-Lösungen, keine Entscheidung. Zusätzlich unerwähnt: Der Footer
     ist aktuell `md:grid-cols-3` (verifiziert in `Footer.astro`); eine vierte Spalte erfordert
     zwingend eine Grid-Anpassung, die die Spec nicht nennt.
   - "Besuchen Sie uns"-Sektion (index.astro): "ergänzen ... **oder** ganz streichen" – auch
     hier keine Entscheidung, obwohl das eine sichtbare Struktur-Frage ist (bleibt die Sektion
     oder nicht?).
   - Der "Kicker" wird zweimal unterschiedlich beschrieben: in 2.2 als Text in
     "Brand-Dark oder V-ZUG-Blau", in 2.1 zusätzlich als "#0aa0c8 bei 15% Deckkraft als
     Verlauf ... für die Kicker-Elemente". Es bleibt offen, ob das ein Hintergrund-Verlauf,
     eine Linie/ein Unterstrich oder etwas anderes ist, und wie sich das zur textfarbe
     verhält – zwei nicht aufeinander bezogene Teilspezifikationen für dasselbe Element.
   - Die Typografie-Skala nennt rohe px-Werte (40/56, 28/34) ohne zu sagen, wie sie im
     bestehenden Tailwind-v4-`@theme`-Setup (`global.css`) umgesetzt werden sollen (neue
     Theme-Tokens vs. `text-[Npx]`-Arbitrary-Values) und ohne den Breakpoint zu benennen
     (bestehender Code nutzt für den Hero `sm:`, die Spec sagt nur pauschal "Desktop").
   **Verbesserungsvorschlag:** Jede "oder"-Formulierung auflösen in eine einzige Entscheidung;
   Kicker-Optik (Text + ggf. Linie/Verlauf) als ein zusammenhängendes Mini-Mockup statt zweier
   Tabellenzeilen beschreiben; Typografie-Werte mit konkreter Tailwind-Umsetzung (Token oder
   Arbitrary Value) und Breakpoint-Namen versehen.

3. **Farb-"Rollen-Disziplin" wird als Kernleistung verkauft, aber nicht konsequent auf
   bestehenden Code angewendet.** Die Spec postuliert: Accent = "nie mehr als
   Primär-CTA-Farbe". Im bestehenden Code färbt sich das Gerätekachel-Icon bei Hover jedoch
   accent-farbig (`group-hover:text-accent`, `index.astro` Zeile 82) – und die Kachel-Auswahl
   ist der zentrale Conversion-Pfad der Startseite, keine "sekundäre/informative Aktion".
   Abschnitt 3 ("Gerätewahl-Sektion") erwähnt nur Kicker und H2-Grösse, aber nicht diesen
   Hover-Zustand – die neue Farbregel wird also nicht lückenlos durchgezogen, obwohl genau
   diese Lückenlosigkeit als Verbesserung gegenüber dem aktuellen "CTA-Chaos" (Diagnosepunkt 6)
   verkauft wird.
   **Verbesserungsvorschlag:** Hover-Zustand der Icons explizit in die Farbregel aufnehmen
   (z. B. auf `text-brand-dark` statt `text-accent` ändern) oder begründen, warum dieser Fall
   eine bewusste Ausnahme ist.

4. **Neue Vertrauensleiste dupliziert Inhalte, die wenige Scrollhöhen später fast wortgleich
   wiederholt werden.** Die Vertrauensleiste soll u. a. "Seit fast 100 Jahren im Rheintal" und
   "V-ZUG Regionalpartner" zeigen; die Regionalpartner-Karte weiter unten (3.6) bekommt
   zusätzlich Kicker-Ausbau und einen `border-t-4 border-vzug`-Akzent für praktisch dieselbe
   Aussage. Für eine Zielgruppe, die laut Research Wert auf "seriöse, nicht werblich-reisserische"
   Kommunikation legt, kann zweifache Wiederholung derselben Kernbotschaft (Alter + Partnerstatus)
   auf einer einzigen Scrollseite eher redundant als vertrauensbildend wirken. Die Spec
   thematisiert dieses Überschneidungsrisiko nicht.
   **Verbesserungsvorschlag:** Vertrauensleiste und Regionalpartner-Karte inhaltlich
   differenzieren (Leiste = kompakte Fakten-Zeile, Karte = Kontext/Erklärung "warum das für Sie
   relevant ist"), statt dieselben zwei USPs zweimal in Badge-Form zu präsentieren.

## Kleinere Anmerkungen

- Kein Hinweis auf Kontrastprüfung (WCAG AA) für neue Farbkombinationen, obwohl die
  Zielgruppe laut Research eher älter ist – besonders die 13px-Uppercase-Kicker-Schrift und
  weisser Text auf der halbtransparenten `bg-slate-900/60`-Bildunterschrift sind
  kontrastkritische Kandidaten, die kurz erwähnt werden sollten.
- Die Zeitleisten-Farbregel (`ueber-uns.astro`) für Meilensteine ist gut zu Ende gedacht,
  behandelt aber den Fall nicht, dass ein Meilenstein sowohl firmenintern als auch
  V-ZUG-bezogen sein könnte (z. B. "seit X Jahren Regionalpartner") – welche Farbe gilt dann?
- Die abstrakte Rhythmus-Regel "jede dritte Sektion bekommt mehr Raum + Flächenfarbwechsel"
  (2.3) passt nicht exakt auf die konkrete Sektionsreihenfolge aus Abschnitt 3 – dort bleibt
  unklar, welche Sektion "die dritte" im Sinne der Regel ist, sobald die "Persönlich vor
  Ort"/"Service"-Zusammenlegung die Sektionszahl verändert.
- Verifiziert: Diagnosepunkt 6 (CTA-Farb-Inkonsistenz Hero vs. `ueber-uns.astro`) stimmt exakt
  mit dem Code überein (`bg-accent` im Hero, `bg-brand` in `ueber-uns.astro` Zeile 105 und
  `geraeteanfrage.astro` Zeile 87) – guter, überprüfbarer Beleg.

## Was funktioniert gut

- Diagnose-Abschnitt ist konkret und codebelegt, keine vagen Behauptungen ("wirkt generisch")
  ohne Beispiel.
- Farbsystem bleibt additiv (keine neuen Farben, nur Rollen-Zuweisung) – passt zur
  "kein Neuentwurf"-Prämisse und löst das reale CTA-Konsistenzproblem.
- Priorisierte Umsetzungsreihenfolge nach Aufwand/Wirkung ist für die Übergabe an
  `frontend-developer` sinnvoll gestuft.
- Bestehende, bereits gute Elemente (Zeitleiste, Icon-Set) werden bewusst erhalten statt
  overengineert ersetzt.
