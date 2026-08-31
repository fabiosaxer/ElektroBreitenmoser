# Design-Spezifikation: Gezielte Weiterentwicklung des visuellen Konzepts

Stand: 31.08.2026. Grundlage: `docs/research.md`, bestehender Code (`src/pages/index.astro`,
`src/pages/ueber-uns.astro`, `src/pages/geraeteanfrage.astro`, `src/components/Header.astro`,
`src/components/Footer.astro`, `src/styles/global.css`). Diese Spezifikation ist **kein
Neuentwurf**, sondern eine gezielte Verbesserung des bestehenden, funktional fertigen Konzepts.
Alle Markenfarben (`--color-brand #1e5aa0`, `--color-accent #0aa0c8`, `--color-vzug #14328c`)
bleiben erhalten. Zielgruppe laut Research: 35–65 Jahre, Eigenheimbesitzer, Premium-Segment,
schätzt Kontinuität, persönliche Beziehung und Schweizer Qualität statt Rabatt-Ästhetik –
Design muss das ausstrahlen, nicht generische SaaS-Template-Optik.

## 1. Diagnose: Warum das aktuelle Konzept austauschbar wirkt

Das Fundament ist solide (gute Fotos, saubere Struktur, bereits ein bespoke Icon-Set für die
Gerätekacheln). Die Schwäche liegt nicht im "Was", sondern im "Wie":

1. **Monotone Sektions-Rhythmik.** Auf `index.astro` folgen sieben Sektionen im fast
   identischen Muster: `py-16`, `text-2xl font-semibold text-slate-900` als Überschrift,
   Fliesstext in `slate-600`, dann Bild-links/rechts- oder Grid-Layout. Beim Scrollen entsteht
   kein Rhythmus, kein Ankerpunkt – jede Sektion sieht wie eine Wiederholung der vorherigen aus.
   Das ist der stärkste "Templatehaft"-Eindruck der Seite.
2. **Typografie ohne Kontrast-Absicht.** Es gibt nur eine Schriftfamilie (Tailwind-Systemfont-
   Stack, kein bewusst gewähltes Pairing) und praktisch nur zwei Textrollen: H1 (Hero) und ein
   einziges, überall identisches H2 (`text-2xl font-semibold`). Zwischen H1 und H2 fehlt eine
   Zwischenstufe, es gibt keine Auszeichnungs-/Kicker-Ebene, die "seit fast 100 Jahren",
   "Regionalpartner" o. ä. optisch als Marken-Signal hervorhebt.
3. **Markenfarben werden kaum eingesetzt.** `--color-brand`, `--color-accent` und
   `--color-vzug` tauchen fast nur in Buttons/Links/Hover-Zuständen auf. 90 % der Fläche ist
   Weiss/`slate-50`/`slate-600` – austauschbar mit jedem x-beliebigen Handwerker-Template. Der
   V-ZUG-Blauton (#14328c) wird nur als 70%-Overlay im Hero verwendet und sonst nicht als
   Gestaltungselement genutzt, obwohl er die offizielle Partnerfarbe ist und Vertrauen signalisieren
   könnte.
4. **Kein visueller Vertrauens-/Beweis-Moment.** Die stärksten USPs aus dem Research
   ("seit fast 100 Jahre", "V-ZUG Regionalpartner", "Ende-zu-Ende-Begleitung") stehen nur als
   Fliesstext in Absätzen. Es gibt keine kompakte, sofort erfassbare Vertrauensleiste
   (Badges/Kennzahlen) direkt unter dem Hero – gerade bei einer eher konservativen, älteren
   Zielgruppe ist das ein verschenkter Signal-Moment.
5. **Bildnutzung uneinheitlich und ohne Bildsprache-Konzept.** Die Showroom-Galerie (4 Bilder,
   `aspect-square`, reines `object-cover`) wirkt wie eine Stock-Foto-Kachelreihe ohne
   Beschriftung/Kontext. Andere Sektionen kombinieren Bilder unterschiedlichen Formats
   (`aspect-[3/1]`, freie Höhe, `h-40`) ohne erkennbares System – jede Bild-Text-Sektion "erfindet"
   ihr Seitenverhältnis neu, was unruhig wirkt statt kuratiert.
6. **CTA-Hierarchie widersprüchlich.** Im Hero ist der Anruf-Button `bg-accent` (Cyan) und die
   Geräteanfrage sekundär (Outline). Auf `ueber-uns.astro` ist "Geräteanfrage stellen" dagegen
   `bg-brand` (Blau) – ohne erkennbares Prinzip wechselt die Primärfarbe der wichtigsten
   Handlung von Seite zu Seite.
7. **Karten/Buttons ohne eigene Formsprache.** `rounded-md` (6px), dünne `slate-200`-Border,
   Standard-Schatten `shadow-sm` – das ist die Tailwind-Default-Ästhetik, die auf tausenden
   Websites identisch vorkommt. Es gibt kein wiedererkennbares, markenspezifisches Detail (z. B.
   eine charakteristische Ecke, Linienführung, Badge-Form), das die Seite von einem generischen
   Template unterscheidbar macht.
8. **Header ohne Präsenz.** Reiner weisser Balken, keine Tiefe, kein Scroll-Verhalten – bei einer
   Seite mit langen, bildlastigen Sektionen sollte der Header beim Scrollen erkennbar bleiben
   (Schatten/Trennlinie erst nach Scroll), aktuell verschwimmt er mit dem Seiteninhalt.
9. **Footer ohne Zusatznutzen.** Rein textlich, keine Öffnungszeiten/Kartenausschnitt/visuelles
   Element – vertane Chance, da "Besuch nach Vereinbarung" ein wiederkehrendes Bedürfnis ist
   (Segment A/B will schnell wissen: wann erreichbar, wo genau).

**Was bereits gut ist und bewusst erhalten bleibt:** die handgezeichneten Line-Icons für
Gerätekategorien (`ApplianceIcon.astro`), die Zeitleisten-Komponente auf `ueber-uns.astro`
(echtes, nicht-generisches Element), die klare Informationsarchitektur (Start → Auswahl →
Anfrage), und die drei Markenfarben selbst.

## 2. Design-System – Erweiterung (nicht Ersatz)

### 2.1 Farbpalette (bestehende Werte behalten, gezielt ergänzen)

| Rolle | Hex | Verwendung (neu/präzisiert) |
|---|---|---|
| Brand (Breitenmoser-Blau) | `#1e5aa0` | Primäre Handlungsfarbe **auf der ganzen Site einheitlich**: Hauptbutton, aktive Nav, Fokus-Ring |
| Brand Dark | `#163f73` | Hover/Active-Zustand von Brand, Text auf hellem Grund für starken Kontrast (z. B. Kicker-Text) |
| Brand 50/100 | `#eef4fb` / `#d8e6f5` | Neu einsetzen als **Sektions-Hintergrund** (statt `slate-50`) für Sektionen mit Marken-Bezug – erzeugt einen leichten Blaustich statt neutralem Grau und bindet die Farbe in die Fläche ein, nicht nur in Buttons |
| Accent (Cyan) | `#0aa0c8` | Reserviert für **sekundäre/informative Aktionen** (z. B. "Rezepte entdecken", externe Links, Telefon-Icon-Akzent) – nie mehr als Primär-CTA-Farbe, um Konkurrenz zu Brand zu vermeiden |
| Accent Dark | `#087f9e` | Hover von Accent |
| V-ZUG-Blau | `#14328c` | Bewusst exklusiv für **"das ist offizieller V-ZUG-Content"**: Regionalpartner-Badge-Hintergrund, dünne Trennlinie/Kicker vor Sätzen, die V-ZUG als Hersteller referenzieren (Werk Sulgen, "seit 1913"). Dadurch bekommt die Farbe eine erkennbare Bedeutung statt nur Hero-Overlay zu sein |
| Neutral (Text) | `slate-900` / `slate-600` / `slate-500` | Unverändert, aber **Slate-50 als Flächenfarbe zurückfahren** zugunsten von Brand-50 (siehe oben) und reinem Weiss – Slate wirkt aktuell wie Default-Tailwind-Grau |

Begründung: Keine neue Farbe wird eingeführt. Der Effekt entsteht durch **Rollen-Disziplin** –
jede der drei bestehenden Farben bekommt eine eindeutige, nie überschneidende Bedeutung
(Brand = "wir/Handlung", Accent = "sekundär/informativ", V-ZUG-Blau = "Herstellermarke"), statt
dass alle drei austauschbar für Buttons verwendet werden. Diese Disziplin gilt **ausnahmslos**,
auch für Bestandsstellen, die im aktuellen Code Accent unpassend einsetzen: Der
Gerätekachel-Icon-Hover (`group-hover:text-accent`, `index.astro` Zeile 82) wechselt zu
`text-brand-dark` (siehe 2.4) – die Kachel-Auswahl ist der zentrale Conversion-Pfad der
Startseite, keine "sekundäre/informative Aktion", und darf daher keine Accent-Farbe tragen.
Es gibt keine Ausnahme von der Rollen-Regel. Kicker-Elemente (siehe 2.2) sind reiner Text ohne
zusätzliches Hintergrund- oder Linienelement – sie brauchen deshalb keine eigene, vierte
Akzentfarbe und bleiben innerhalb der drei bestehenden Rollen.

### 2.2 Typografie

Aktuell: Tailwind-Default-Systemfont-Stack, keine bewusste Wahl. **Entscheidung: eine einzige
Schriftfamilie (Sans-Serif, Systemfont-Stack) bleibt bestehen, keine zweite Schrift wird
nachgeladen.** Es gibt keine Ausnahme, keine optionale Serife für Überschriften.

Begründung (statt der zuvor unbegründeten Serifen-Empfehlung): `research.md` sagt zur
Zielgruppe nichts über Typografie-Präferenzen, aber explizit "konservativ, älter, Vertrauen
wichtiger als Trend" und "kein Jugend-/Trend-Slang" (Abschnitt 1, Tonalität). Eine Serife wäre
eine reine Differenzierungs-Wette gegenüber Wettbewerbern (Fust, Weber, Hasler sind ebenfalls
Sans-Serif) ohne Stütze im Research – und V-ZUGs eigene Markenwelt sowie Schweizer
Corporate-Design-Tradition sind nüchtern-sans-serif; eine Serife für eine Elektrogeräte-
Fachhandelsmarke kann eher wie Boutique/Notariat wirken als wie "Schweizer Technik-Qualität".
Zusätzlich widerspräche das Nachladen einer zweiten (Google-)Schriftfamilie dem eigenen
Performance-Argument für ältere/mobile Nutzer. Die wahrgenommene Hierarchie, die fehlt (siehe
Diagnosepunkt 2), wird stattdessen durch **bewusste Gewichts-, Grössen- und Farbdifferenzierung
innerhalb einer Schrift** erzeugt – das ist die etablierte, risikoarme Lösung für genau dieses
Problem und passt zur nüchternen, seriösen Markenwahrnehmung.

- **Einzige Schriftfamilie (Überschriften wie Fliesstext):**
  `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
  sans-serif;` (unverändert, Systemfont – schnell, gut lesbar, neutral, keine
  Ladezeit-/Font-Flash-Risiken).
- **Skala** (ersetzt das aktuelle "fast alles ist `text-2xl`"). Werte sind exakte Tailwind-
  Arbitrary-Values, damit sie ohne weitere Interpretation umsetzbar sind; Basis-Breakpoints wie
  im bestehenden Tailwind-v4-Setup (`sm` 640px, `md` 768px, `lg` 1024px):

  | Ebene | Tailwind-Klassen | Ergebnis | Verwendung |
  |---|---|---|---|
  | Kicker | `text-[13px] font-semibold uppercase tracking-[0.08em]` (kein Breakpoint-Wechsel) | 13px/1.2, alle Breakpoints gleich | Kleines Label über H2, Farbe `text-brand-dark` (firmeneigener Bezug) oder `text-[--color-vzug]` (V-ZUG-Herstellerbezug) – nie beides gemischt in einem Kicker |
  | H1 | `text-[32px] leading-[1.15] font-bold sm:text-[40px] sm:leading-[1.1] lg:text-[56px]` (kein separater `md`-Sprung – `sm`-Wert gilt bis `lg`) | 32px mobil → 40px ab 640px → 56px ab 1024px | Nur Hero |
  | H2 | `text-[24px] leading-[1.3] font-semibold sm:text-[28px] md:text-[30px] lg:text-[34px]` | 24px mobil → 28px ab 640px → 30px ab 768px → 34px ab 1024px | Sektionstitel – **grösser als bisher** (bisher durchgängig 24px/`text-2xl`), um echten Abstand zu H1 und Body herzustellen |
  | H3 | `text-[18px] leading-[1.3] font-semibold` (kein Breakpoint-Wechsel) | 18px/1.3, alle Breakpoints gleich | Karten-/Kachel-Titel |
  | Body | `text-base leading-[1.6]` (16px, unverändert, kein Breakpoint-Wechsel) | 16px/1.6 | Fliesstext |
  | Body klein | `text-sm leading-[1.5]` (14px, unverändert, kein Breakpoint-Wechsel) | 14px/1.5 | Hinweise, Footer |

  Damit entsteht durch den deutlich grösseren H1/H2-Sprung (H1 fast doppelt so gross wie H2,
  H2 spürbar grösser als Body) und die Gewichts-/Farbstufe Kicker → H1/H2 (bold/semibold) →
  H3 (semibold, kleiner) → Body (regular) mehr wahrgenommene Hierarchie, ohne
  Informationsarchitektur oder Font-Familie zu ändern.

### 2.3 Spacing-Skala (formalisieren statt ad hoc)

Basis-Einheit 4px, wie in Tailwind angelegt – aber bewusste Sektions-Rhythmik statt einheitlichem
`py-16` überall:

- **4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px**
- Reguläre Content-Sektion: `py-16` (64px) mobil, `py-24` (96px) Desktop – **wie bisher**, aber:
- **Jede dritte Sektion** (Vertrauens-/Beweis-Sektionen, siehe unten) bekommt bewusst mehr Raum
  (`py-24`/`py-32`) und einen Flächenfarbwechsel (Brand-50 statt Weiss/Slate-50), um den
  Scroll-Rhythmus zu durchbrechen: Weiss → Brand-50 (Vertrauensleiste) → Weiss → Brand-50 (V-ZUG-
  Block) statt aktuell Weiss/Slate-50 im starren Wechsel ohne inhaltliche Logik.
- Kachel-/Card-Innenabstand: 20–24px (bisher `p-5`/`p-6`, beibehalten).

### 2.4 Komponenten-Feinschliff

- **Buttons:** Radius von `rounded-md` (6px) auf `rounded-full` für **Primär-CTAs** ändern
  (z. B. "Geräteanfrage stellen", "Anfrage senden") – Pille statt Standard-Rechteck ist ein
  kleines, aber erkennbares wiederkehrendes Markenzeichen, das in keiner der Wettbewerber-
  Websites (Weber, Hasler, Bichler – alle rechteckige Standard-Buttons) vorkommt. Sekundäre/
  Text-Buttons (z. B. "Mehr über uns erfahren") bleiben ohne Container, nur Pfeil + Unterstrich
  bei Hover.
- **Primär-CTA-Farbe vereinheitlichen:** Immer `bg-brand` (nicht `bg-accent`) für die
  wichtigste Handlung auf jeder Seite. Der Hero-Anruf-Button wird von `bg-accent` auf `bg-brand`
  umgestellt; Accent bleibt reserviert (siehe 2.1).
- **Karten (Gerätekacheln):** Border von `slate-200` auf `brand-100` ändern (dezenter
  Blau-statt-Grau-Ton), Hover-Zustand zusätzlich mit leichtem Farbverlauf-Hintergrund
  (`brand-50`) statt nur Border-Farbwechsel – macht die Interaktion "wärmer". **Zusätzlich:**
  Icon-Hover-Farbe von `group-hover:text-accent` (`index.astro` Zeile 82) auf
  `group-hover:text-brand-dark` ändern. Die Gerätewahl ist der zentrale Conversion-Pfad der
  Startseite, keine sekundäre Aktion – Accent ist laut 2.1 exklusiv "sekundär/informativ"
  reserviert. Es handelt sich nicht um eine bewusste Ausnahme, sondern um dieselbe
  Inkonsistenz, die die Spec beim Hero-Button bereits korrigiert (Diagnosepunkt 6); sie wird
  hier konsequent mitkorrigiert, damit die Rollen-Disziplin lückenlos gilt.
- **Vertrauensleiste (neu, kleines Element, kein neuer Seitenaufbau):** Direkt unter dem Hero,
  vor der Gerätekachel-Sektion, eine schmale Zeile mit 4 Kurz-Fakten als Inline-Badges (kein
  Kartendesign, nur Text + Icon, dezente vertikale Trennlinie dazwischen):
  "Seit fast 100 Jahren im Rheintal · Beratung bis Installation aus einer Hand · Lieferung
  Schweizweit · Persönliche Beratung vor Ort". Hintergrund `brand-50`, Text `brand-dark`, sehr
  kompakt (py-4), **rein aufzählend, ohne Erklärung** – die Leiste ist ein schneller
  Scan-Moment direkt nach dem Hero, kein Ort für Kontext.
  **Bewusst nicht enthalten: "V-ZUG Regionalpartner".** Diese Aussage bekommt weiter unten
  (3.6) ihre eigene Karte, die sie nicht nur nennt, sondern erklärt, was der Status für die
  Kundschaft bedeutet (offizielle Partnerschaft statt Graumarkt-Händler). Ohne diese Trennung
  würde dieselbe Kernaussage zweimal auf derselben Scrollseite wiederholt – Leiste = kompakte
  Fakten-Zeile, Karte = Kontext/Bedeutung. Das ist die günstigste Massnahme, um die übrigen
  USPs aus dem Research sofort sichtbar zu machen, ohne die Seite zu verlängern oder Inhalte
  doppelt zu präsentieren.
- **Bildformate vereinheitlichen:** Für alle Bild-Text-Sektionen ("Persönlich vor Ort",
  "Service & Lieferung") einheitlich `aspect-[4/3]` für das Hauptbild verwenden statt freier
  Höhe/`aspect-[3/1]`-Mischung. Für die Showroom-Galerie: Bildunterschriften einblenden (kleiner
  Caption-Streifen unten, halbtransparent, `bg-slate-900/60`, weisser Text) statt kontextlose
  Kachelreihe – macht aus "4 zufälligen Fotos" eine kuratierte Produktübersicht.
- **Header:** Bei Scroll (>10px) `shadow-sm` und `bg-white/95 backdrop-blur` hinzufügen (kleines
  JS/CSS, kein Strukturwechsel) – sorgt für Tiefe ohne die Seite optisch zu verändern, wenn man
  oben ist.
- **Footer:** Vierte Spalte ergänzen mit Öffnungszeiten-Hinweis ("Besuch nach Vereinbarung,
  bitte vorab anrufen") und **Standort-Icon + Adresse, verlinkt auf Google Maps** (Entscheidung,
  kein statisches Karten-Vorschaubild: kein zusätzlicher Bild-Asset/keine Pflege bei
  Adressänderung nötig, funktioniert identisch auf allen Geräten, und der Link öffnet bei Bedarf
  direkt die Navigation – höherer Nutzwert bei geringerem Aufwand als ein Kartenbild). Da der
  bestehende Footer `md:grid-cols-3` ist (`Footer.astro` Zeile 6), muss das Grid für die vierte
  Spalte auf `md:grid-cols-4` erweitert werden.

## 3. Sektionsweise Verbesserungen

### Startseite (`index.astro`)

1. **Hero:** Overlay von `bg-vzug/70` (Vollfläche) auf einen **Verlauf** ändern:
   `bg-gradient-to-t from-vzug/85 via-vzug/50 to-vzug/20` – lässt das Foto oben mehr durchscheinen,
   wirkt weniger wie ein plattes Farbfeld über dem Bild. CTA-Reihenfolge: Brand-Button
   ("Geräteanfrage stellen", jetzt primär/gefüllt) zuerst, Anruf-Link sekundär (Outline) –
   Begründung: die Anfrage ist der bevorzugte, nachverfolgbare Conversion-Pfad, der Anruf bleibt
   für eilige Nutzer (Segment B) jederzeit sichtbar, kehrt aber die Hierarchie zur Konsistenz mit
   Header/übriger Seite um.
2. **Neu: Vertrauensleiste** direkt nach dem Hero (siehe 2.4) – schliesst die Lücke zwischen
   Bild-Emotion (Hero) und Funktion (Gerätewahl).
3. **Gerätewahl-Sektion:** Kicker "WÄHLEN SIE IHREN GERÄTEBEREICH" ergänzen, H2 vergrössern.
   Kachel-Hover wie in 2.4 beschrieben verfeinern, **inklusive** der Icon-Hover-Farbkorrektur
   (`accent` → `brand-dark`). Struktur (Grid, Icons) bleibt unverändert – funktioniert gut.
4. **Showroom-Galerie:** Captions ergänzen (siehe 2.4), Hintergrund bleibt `brand-50` statt
   `slate-50`.
5. **"Persönlich vor Ort" + "Service & Lieferung":** Diese beiden Sektionen sind inhaltlich und
   strukturell fast identisch (Bild+Text, Bild+Text) und laufen direkt hintereinander – das
   verstärkt die Monotonie am stärksten. Vorschlag: zusammenlegen zu **einer** Sektion mit
   einem Bild und einer zweispaltigen Text-Liste (links "Persönlich vor Ort"-Text, rechts die
   Service/Lieferungs-Stichpunkte + Ersatzteil-Hinweis), dafür Raum für die neue Vertrauensleiste
   gewinnen. Reduziert Redundanz, ohne Inhalt zu verlieren.
6. **Regionalpartner/Rezepte-Karten:** Die Regionalpartner-Karte bekommt den V-ZUG-Blauton als
   Kicker-Farbe und einen dünnen `border-t-4 border-[--color-vzug]` als visuelles Signal
   "offizieller Hersteller-Content" – unterscheidet sie bewusst von der Rezepte-Karte (Accent-
   Farbe, da sekundärer/externer Link). **Text-Anpassung gegen die Dopplung mit der
   Vertrauensleiste:** Die Karte nennt "V-ZUG Regionalpartner" nicht mehr nur als Fakt (das
   steht bereits nicht mehr in der Leiste, siehe 2.4), sondern erklärt kurz die Bedeutung für
   die Kundschaft, z. B. "Als offizieller V-ZUG Regionalpartner beraten wir Sie mit direktem
   Zugang zu Herstellerwissen, Originalteilen und Garantieabwicklung – kein Graumarkt-Handel."
   So bleibt die Kernaussage einmal kompakt (Leiste) und einmal erklärt (Karte), statt zweimal
   badge-artig wiederholt zu werden.
7. **"Besuchen Sie uns" (Schluss-Sektion): wird gestrichen.** Entscheidung statt Alternative:
   Die Sektion enthält aktuell nur Fliesstext ohne Mehrwert gegenüber dem ohnehin
   überarbeiteten Footer (siehe 2.4, neue vierte Spalte mit Öffnungszeiten + Standort-Link).
   Eine zusätzliche Standort-Sektion direkt vor dem Footer würde dieselbe Information ein
   drittes Mal auf der Seite zeigen (nach Vertrauensleiste/Regionalpartner-Karte) und eine
   funktionslose Leersektion am Seitenende erzeugen. Ersatzlos streichen, Footer übernimmt die
   Funktion vollständig.

### Über uns (`ueber-uns.astro`)

1. Zeitleiste beibehalten – gutes, bespoke Element. Farblich leicht anpassen: der äussere
   Schatten-Ring der Punkte (`shadow-[0_0_0_3px_var(--color-brand)]`) bleibt, aber Jahreszahl-
   Farbe von `text-accent` auf `text-vzug` ändern, sobald die Meilensteine V-ZUG-Bezug haben
   (Regionalpartner-Jahr), und `text-brand-dark` für rein firmeninterne Meilensteine (Gründung,
   Generationenwechsel) – nutzt die Rollen-Disziplin aus 2.1, um die Zeitleiste selbst schon
   zu erzählen, was "unsere Geschichte" vs. "V-ZUG-Bezug" ist.
2. **"V-ZUG seit 1913"-Block:** Hintergrund von `slate-50` auf `brand-50`, Bildrahmen mit
   `border-t-4 border-vzug` versehen wie beim Regionalpartner-Block auf der Startseite –
   Konsistenz zwischen beiden "das ist V-ZUG-Herstellerinhalt"-Momenten.
3. Kicker über H1 ergänzen: "SEIT FAST 100 JAHREN IM RHEINTAL" in V-ZUG-Blau, bevor die grosse
   H1 "Über uns" (siehe Skala in 2.2) folgt – macht den Zeit-USP sofort lesbar, noch vor dem
   Scrollen.

### Geräteanfrage (`geraeteanfrage.astro`)

1. Formular ist funktional gut, wirkt aber sehr "nackt" (nur Formularfelder auf weissem
   Grund, kein Kontext). Vorschlag: zweispaltiges Layout ab Tablet-Breite – links das Formular,
   rechts eine schmale Spalte mit den 3–4 Vertrauensleiste-Punkten (wiederverwendet, vertikal
   gestapelt) plus Telefonnummer als Alternative ("Lieber persönlich? 071 777 12 76"). Das
   nimmt dem Formular die Kälte eines reinen Kontaktformulars und erinnert kurz vor dem Absenden
   nochmal an die USPs.
2. Eingabefelder: Fokus-Ring-Farbe bleibt Brand (gut), aber Radius der Inputs von `rounded-md`
   auf `rounded-lg` (8px) leicht vergrössern, damit sie zur neuen Pillenform der Buttons besser
   passen (nicht identisch, aber weicher als das aktuelle 6px-Standard-Tailwind-Maß).
3. Submit-Button: `rounded-full`, `bg-brand` (bereits korrekt), zusätzlich volle Breite auf
   Mobile (`w-full sm:w-auto`) für leichtere Bedienung mit dem Daumen (Zielgruppe 35–65, teils
   auf Tablet/Smartphone unterwegs).

### Header / Footer

Siehe 2.4 (Scroll-Schatten Header, vierte Footer-Spalte mit Öffnungszeiten/Standort-Link).
Navigations-Struktur selbst bleibt unverändert – drei Punkte plus Telefon-CTA ist für den
Seitenumfang richtig dimensioniert.

## 4. Responsive-Verhalten (Ergänzungen zum Bestehenden)

- **Vertrauensleiste:** Auf Mobile (< 640px) die 4 Punkte nicht nebeneinander, sondern als
  2×2-Grid mit Icon links, statt einer einzeiligen Liste, die sonst umbricht/abgeschnitten wirkt.
- **H1/H2 auf Mobile:** Werte und Zeilenhöhen sind bereits in der Skala (2.2) pro Breakpoint
  festgelegt (kein separates Mobile-Sonderverhalten nötig, da eine Sans-Serif bei den gewählten
  Grössen keine zusätzliche Zeilenhöhen-Korrektur braucht).
- **Zusammengelegte "Persönlich vor Ort"-Sektion (Punkt 5 oben):** Auf Mobile Bild zuerst, dann
  Fliesstext, dann Stichpunkt-Liste, dann Ersatzteil-Hinweis – vertikale Reihenfolge nach
  Wichtigkeit, nicht als erzwungenes Nebeneinander-Grid, das bei zwei Textblöcken auf schmalen
  Screens zu lang würde.
- **Geräteanfrage-Formular:** Zweispaltiges Layout (Punkt 1 oben) erst ab `md:` (768px);
  darunter USP-Spalte unter dem Formular, nicht davor (Formular hat Priorität auf Mobile, da
  Nutzer meist mit klarer Absicht kommen).
- **Header-Scroll-Effekt:** Ausschliesslich CSS/kleines Script, kein Layout-Sprung – Header-Höhe
  bleibt in beiden Zuständen identisch, nur Schatten/Transparenz ändert sich, um "Content-Jump"
  beim Scrollen zu vermeiden.

## 5. Priorisierte Umsetzungsreihenfolge (für frontend-developer)

Empfehlung nach Aufwand/Wirkung, keine harte Vorgabe:

1. **Sofort/günstig, hohe Wirkung:** Neue Typografie-Skala (2.2, Kicker + grössere/differenzierte
   H1/H2, keine neue Schriftfamilie) umsetzen; Kicker-Element einführen; Vertrauensleiste nach
   Hero; Primär-CTA-Farbe vereinheitlichen (Brand statt Accent im Hero); Gerätekachel-Icon-Hover
   von Accent auf Brand-Dark korrigieren; Button-Radius auf `rounded-full` für Primär-CTAs;
   "Besuchen Sie uns"-Sektion streichen.
2. **Mittel:** Flächenfarben (Brand-50 statt Slate-50) durchziehen; V-ZUG-Blau als
   "Hersteller-Content"-Signal (Border-Akzent) auf Regionalpartner-/V-ZUG-Blöcken;
   Regionalpartner-Karten-Text erweitern (Bedeutungserklärung statt reiner Faktennennung);
   Showroom-Captions; Header-Scroll-Schatten.
3. **Grösser (Struktur-Änderung):** "Persönlich vor Ort" + "Service & Lieferung" zusammenlegen;
   zweispaltiges Layout für Geräteanfrage-Formular; Footer-Grid auf `md:grid-cols-4` erweitern
   und vierte Spalte mit Öffnungszeiten/Standort-Link (Google Maps) ergänzen.

Alle Massnahmen sind additiv zum bestehenden Code – keine der drei Markenfarben, keine der
funktionalen Komponenten (Zeitleiste, Icon-Set, Kachel-Auswahl-Logik) muss ersetzt werden.
