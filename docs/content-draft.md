# Content-Entwurf: Startseite & Über uns

Stand: 31.08.2026. Grundlage: `docs/research.md` (Fakten, USPs, Tonalität) und
`docs/design-spec.md` (Layout-/Sektionsstruktur). Enthält nur Text – Umsetzung
durch `frontend-developer`. Es werden **keine neuen Fakten** eingeführt
(keine Jahreszahlen, keine Kundenzahlen); die `19XX`-Platzhalter in der
Zeitleiste bleiben unverändert, nur der umgebende Text wurde geschärft.

Tonalität durchgängig: professionell, seriös, persönlich, Schweizer
Hochdeutsch, kurze Sätze, kein Werbe-Slang. Terminologie einheitlich:
"V-ZUG Fachhändler" / "V-ZUG Regionalpartner", "Rheintal", "Lieferung in die
ganze Schweiz" (ersetzt uneinheitliches "Versand"/"Lieferung"-Mischen im
Bestandscode), "Geräteanfrage" als CTA-Begriff.

---

## Startseite (`index.astro`)

### Hero

Kein inhaltlicher Fakten-Wechsel – Text leicht geschärft, Struktur/CTA-Reihenfolge
gemäss Design-Spec (Brand-Button "Geräteanfrage stellen" zuerst, Anruf-Link
sekundär):

- **H1:** Ihr V-ZUG Fachhändler in Marbach
- **Subline:** Seit fast 100 Jahren beraten wir Sie persönlich rund um V-ZUG
  Küchen- und Waschereigeräte – von der Auswahl bis zur Installation, aus dem
  Rheintal.
- **CTA 1 (primär, bg-brand):** Geräteanfrage stellen
- **CTA 2 (sekundär, Outline):** 071 777 12 76 anrufen

*Begründung:* "Fachhändler" statt "Partner" ist konkreter und deckt sich mit
dem SEO-Vokabular aus dem Research ("V-ZUG Fachhändler Rheintal"); "Partner"
bleibt für den späteren Regionalpartner-Kontext reserviert, damit der Begriff
dort seine volle Bedeutung behält statt schon im Hero verbraucht zu werden.
Die Subline ergänzt "von der Auswahl bis zur Installation" als knappe
Vorschau auf die Ende-zu-Ende-Begleitung (USP 4), ohne neue Fakten.

### Neu: Vertrauensleiste (direkt nach dem Hero)

Vier kompakte Fakten, reihum, ohne Erklärung (Erklärung folgt bei
Regionalpartner-Karte, siehe unten – keine Dopplung):

1. Seit Generationen im Rheintal
2. Beratung bis Installation aus einer Hand
3. Lieferung in die ganze Schweiz
4. Persönliche Beratung vor Ort

*Hinweis für Umsetzung:* "Lieferung in die ganze Schweiz" statt der
Design-Spec-Variante "Lieferung Schweizweit" – damit der Begriff exakt mit
der Formulierung im zusammengelegten Service-Abschnitt weiter unten
übereinstimmt (Terminologie-Konsistenz).

### Gerätewahl-Sektion

- **Kicker:** Wählen Sie Ihren Gerätebereich
- **H2 (unverändert, bewährt):** Wofür dürfen wir Sie beraten?
- **Subline:** Wählen Sie Ihren Gerätebereich – wir übernehmen die Auswahl
  direkt in Ihre Geräteanfrage.

Gerätekacheln/Icons: keine Textänderung, Struktur bleibt.

### Showroom-Galerie

- **H2 (unverändert):** Einblick in unser Sortiment
- **Subline (unverändert):** Eindrücke aus dem V-ZUG Showroom – von der
  Kücheninsel bis zum Waschturm.
- **Bild-Captions (neu, kurz, für den halbtransparenten Streifen):**
  1. Kücheninsel mit V-ZUG Kühl- und Backgeräten
  2. V-ZUG Einbaugeräte in offener Küche
  3. V-ZUG Weinkühlschrank
  4. V-ZUG Waschtürme

### Zusammengelegte Sektion: "Beratung, Lieferung und Installation aus einer Hand"

Ersetzt die beiden bisherigen Einzelsektionen "Persönlich vor Ort" und
"Service & Lieferung" (siehe Design-Spec 3.5). Ein Bild, zwei Textspalten.

- **H2:** Beratung, Lieferung und Installation aus einer Hand

**Linke Spalte – Persönlich vor Ort**
- **H3:** Persönlich vor Ort
- **Text:** Als familiär geführter Betrieb im Rheintal begleiten wir Sie
  persönlich – von der Beratung im Showroom über die Lieferung bis zur
  fachgerechten Installation bei Ihnen zu Hause.
- **Link:** Mehr über uns erfahren →

**Rechte Spalte – Service & Lieferung**
- **H3:** Service & Lieferung
- **Stichpunkte (Reihenfolge nach Ablauf):**
  - Persönliche Beratung und Verkauf von V-ZUG Geräten
  - Lieferung in die ganze Schweiz
  - Geräteservice und Support
- **Hinweis (unverändert, Fakt bleibt bestehen):** Ersatzteile verkaufen wir
  nicht direkt ab Lager. Bei Ersatzteilbedarf wenden Sie sich bitte an V-ZUG
  direkt: 058 767 67 84.

### Regionalpartner- und Rezepte-Karten

**Karte 1 – V-ZUG Regionalpartner** (Kicker + `border-t-4` in V-ZUG-Blau,
erklärt die Bedeutung statt nur den Status zu nennen – vermeidet Dopplung mit
der Vertrauensleiste):

- **Kicker (V-ZUG-Blau):** Offizielle V-ZUG Partnerschaft
- **H2 (unverändert):** V-ZUG Regionalpartner
- **Text:** V-ZUG steht seit 1913 für Schweizer Qualität – dazu zählt auch das
  CO2-neutrale Werk Sulgen, laut V-ZUG die "modernste Kühlgerätefabrik
  Europas". Als offizieller Regionalpartner beraten wir Sie mit direktem
  Zugang zu Herstellerwissen und aktueller Produktkompetenz – kein
  Graumarkt-Handel.

**Karte 2 – Rezeptideen entdecken** (unverändert, Accent-Farbe da externer,
sekundärer Link – bleibt inhaltlich wie bisher):

- **H2 (unverändert):** Rezeptideen entdecken
- **Text (unverändert):** Was lässt sich mit Ihrem V-ZUG Gerät alles zaubern?
  Auf vzug.com finden Sie zahlreiche Rezepte, abgestimmt auf Ihre Geräte.
- **Link:** Rezepte entdecken →

### Gestrichene Sektion: "Besuchen Sie uns"

Wird ersatzlos entfernt (Design-Spec 3.7) – Standort/Öffnungszeiten wandern
in die neue vierte Footer-Spalte (siehe unten). Kein Text-Ersatz auf der
Startseite nötig.

---

## Footer (globale Komponente, vierte Spalte neu)

Notwendig, weil die gestrichene "Besuchen Sie uns"-Sektion diese Funktion
jetzt vollständig übernehmen muss:

- **H2 (Spaltentitel):** Besuch & Anfahrt
- **Text:** Besuch nach Vereinbarung – bitte vorab kurz anrufen.
- **Link (Standort-Icon + Adresse, verlinkt auf Google Maps):**
  Fortunastrasse 2, CH-9437 Marbach

---

## Über uns (`ueber-uns.astro`)

### Hero/Intro

- **Kicker (V-ZUG-Blau):** Traditionsreicher Familienbetrieb im Rheintal
- **H1 (unverändert):** Über uns
- **Subline (unverändert zur Vorversion, keine Jahreszahl-Präzisierung):**
  Persönliche Beratung, ausgeprägte Produktkenntnis und Schweizer Qualität –
  das ist unser Anspruch als V-ZUG Regionalpartner im Rheintal.

### Zeitleiste

**Unverändert (Faktenlücken bleiben Platzhalter, nicht antasten):**
- Jahr-Platzhalter `19XX`/`20XX` und die zugehörigen TODO-Texte für
  "Gründung", "Generationenwechsel", "V-ZUG Regionalpartner" und "Standort
  Fortunastrasse" bleiben exakt wie im Code – diese Fakten fehlen noch vom
  Kunden.

**Überarbeitet (kein Platzhalter, echter Inhalt):**
- **Meilenstein "Heute" – Titel (unverändert):** Elektro Breitenmoser AG
- **Text (neu):** Unter der Leitung von Daniel Benz begleiten wir Sie heute
  persönlich – von der Beratung bis zur Installation.

*Begründung:* Der alte Text ("… beraten wir Sie persönlich rund um V-ZUG
Geräte") bleibt bei "Beratung" stehen, obwohl die Firma laut Research explizit
mit der Ende-zu-Ende-Kette (Beratung → Verkauf → Lieferung → Installation)
wirbt. Die neue Formulierung nutzt diese bereits belegte USP, ohne ein neues
Faktum zu behaupten.

### "V-ZUG seit 1913"-Block

- **H2 (unverändert):** V-ZUG seit 1913
- **Text (leicht gestrafft, inhaltlich unverändert):** Von der ersten
  vollautomatischen Waschmaschine bis zur CO2-neutralen Produktion im Werk
  Sulgen: Als Regionalpartner tragen wir dieselbe Schweizer Tradition aus
  Präzision und Qualität mit, die V-ZUG seit über 100 Jahren auszeichnet.

### Schluss-CTA "Bereit für Ihr Projekt?"

Unverändert, da bereits klar und funktional:

- **H2:** Bereit für Ihr Projekt?
- **Text:** Ob neue Küche oder Waschraum – wir beraten Sie unverbindlich und
  begleiten Sie von der Auswahl bis zum fertig eingebauten Gerät.
- **CTA:** Geräteanfrage stellen

---

## Meta-Titel/-Description (erster Vorschlag, Feinschliff durch `seo-specialist`)

**Startseite**
- Title: `V-ZUG Fachhändler Rheintal | Elektro Breitenmoser AG`
- Description: `Ihr V-ZUG Fachhändler in Marbach: persönliche Beratung, Verkauf, Lieferung und Installation – traditionsreich im Rheintal verwurzelt.`

**Über uns**
- Title: `Über uns | Elektro Breitenmoser AG`
- Description: `Traditionsreich im Rheintal: Lernen Sie Elektro Breitenmoser AG kennen – Ihren persönlichen V-ZUG Regionalpartner in Marbach.`
