# Kritisches Review: Content-Entwurf Startseite & Über uns

Geprüftes Artefakt: `docs/content-draft.md`. Abgeglichen mit `docs/research.md`,
`docs/design-spec.md`, `ANFORDERUNGEN.md`, `src/pages/index.astro`,
`src/pages/ueber-uns.astro`.

## Grundsätzliche Einschätzung

Der Entwurf hält sein eigenes Versprechen, "keine neuen Fakten" einzuführen,
im engen Sinn ein – ich finde keine frei erfundenen Jahreszahlen, Kundenzahlen
oder Auszeichnungen. Das ist positiv und keine Selbstverständlichkeit bei
diesem Auftragstyp. Trotzdem ist der Umgang mit der bereits im Research als
heikel markierten "seit fast 100 Jahren"-Aussage nicht sauber: Der Entwurf
übernimmt sie nicht nur, sondern baut ihr eine prominentere Bühne (eigener
Kicker, eigener Vertrauensleisten-Punkt, zwei Meta-Descriptions) – ohne die im
Research selbst dokumentierte Rechenprobe zu machen, ob die Formulierung für
das belegte Handelsregister-Datum überhaupt noch trägt. Daneben übernimmt der
Entwurf unkritisch zwei Detailbehauptungen aus dem Design-Spec-Beispieltext
bzw. aus dem Bestandscode, die selbst nicht im Research belegt sind.

## Kritische Punkte

1. **"Seit fast 100 Jahren" ist für das dokumentierte Handelsregister-Datum
   (1942) rechnerisch nicht mehr plausibel "fast 100 Jahre" – der Entwurf
   verstärkt die Aussage trotzdem, statt sie zu hinterfragen.**
   Was: Stand der Dokumente ist der 31.08.2026. Laut `research.md` (Abschnitt
   1) ist die Handelsregister-Eintragung auf den 24.08.1942 datiert – das
   sind 2026 minus 1942 = **84 Jahre**, nicht "fast 100". Nur die
   Alternativquelle (1932, laut Firmendarstellung/Verzeichnissen, nicht laut
   Register) käme mit 94 Jahren nahe an "fast 100" heran. Das Research selbst
   behauptet, "seit fast 100 Jahren" sei "in beiden Fällen sachlich korrekt"
   – das ist für den belegten 1942er-Fall schon zweifelhaft, denn 84 Jahre
   liegen im allgemeinen Sprachgebrauch näher bei "seit über 80 Jahren" als
   bei "fast 100 Jahre". Der Content-Entwurf übernimmt diese ungeprüfte
   Einschätzung nicht nur unverändert, sondern **baut die Aussage zusätzlich
   aus**: Hero-Subline, eigener Vertrauensleisten-Punkt ("Seit fast 100
   Jahren im Rheintal"), eigener Kicker über dem Über-uns-H1, Über-uns-Subline
   sowie beide Meta-Descriptions – macht die Aussage insgesamt fünfmal
   prominent sichtbar, teils als isolierte Kurzbehauptung ohne relativierenden
   Kontext (Kicker, Vertrauensleiste), wo ein Leser sie am ehesten wörtlich
   nimmt.
   Warum problematisch: Genau die Zielgruppe, für die laut Research
   "Vertrauen und Kompetenzsignale" zentral sind (konservativ, traditionsbe-
   wusst, Rheintal), prüft eine solche Aussage im Zweifel selbst nach oder
   kennt die Firmengeschichte lokal. Eine as-Fakt inszenierte Zahl, die sich
   bei genauem Nachrechnen als beschönigt herausstellt, beschädigt genau das
   Vertrauenskapital, das die USP eigentlich aufbauen soll. Zudem ist "seit
   fast 100 Jahren" im offiziellen Handelsregisterkontext (Impressum nennt ja
   ohnehin die Handelsregister-Nr.) ein Widerspruch, den ein aufmerksamer
   Nutzer selbst auflösen kann.
   Verbesserungsvorschlag: Vor Freigabe mit Daniel Benz das tatsächliche
   Gründungsjahr klären (wie im Research selbst als offene Frage vermerkt) –
   das ist ein Blocker, kein Nice-to-have, bevor die Aussage weiter
   ausgebaut/dupliziert wird. Bis dahin die Prominenz eher reduzieren statt
   erhöhen (kein zusätzlicher dedizierter Kicker/Leisten-Punkt), und wo die
   Formulierung stehen bleibt, eher konservativ "seit über 80 Jahren" bzw.
   "seit Jahrzehnten" erwägen, falls 1942 sich als das verlässlichere Datum
   bestätigt.

2. **Regionalpartner-Karte übernimmt konkrete Leistungsversprechen
   ("Originalteile", "Garantieabwicklung") aus dem Design-Spec-Beispieltext,
   ohne dass diese in `research.md` belegt sind.**
   Was: Der Text "Als offizieller Regionalpartner beraten wir Sie mit
   direktem Zugang zu Herstellerwissen, Originalteilen und
   Garantieabwicklung – kein Graumarkt-Handel" (content-draft.md, Zeile
   106–110) übernimmt fast wörtlich das Beispiel aus `design-spec.md`
   (Zeile 224–225). Nur "kein Graumarkt-Handel" und der allgemeine
   Regionalpartner-Status sind im Research (USP 5) tatsächlich belegt.
   "Originalteile" und insbesondere "Garantieabwicklung" als konkrete,
   vom Fachhändler erbrachte Leistungen stehen in `research.md` nirgends –
   im Gegenteil vermerkt das Research explizit, dass **kein
   Ersatzteil-Direktverkauf ab Lager** stattfindet und bei Ersatzteilbedarf
   an V-ZUG direkt verwiesen wird.
   Warum problematisch: "Originalteile" im selben Satz wie die
   Regionalpartnerschaft zu nennen, während zwei Abschnitte weiter unten auf
   derselben Seite explizit steht "Ersatzteile verkaufen wir nicht direkt ab
   Lager", erzeugt einen sachlichen Widerspruch bzw. zumindest eine
   irreführende Erwartung (Segment C sucht laut Research explizit klare
   Aussagen zu genau diesem Punkt). "Garantieabwicklung" ist eine konkrete
   Serviceleistung, die so in keiner Quelle bestätigt ist – das ist eine
   unbelegte Behauptung, keine Textschärfung.
   Verbesserungsvorschlag: Entweder mit dem Kunden verifizieren, ob
   Garantieabwicklung/Originalteilzugang tatsächlich zum Leistungsumfang
   gehören, oder die Formulierung auf das im Research tatsächlich Belegte
   zurückstutzen (z. B. "direkter Zugang zu Herstellerwissen – kein
   Graumarkt-Handel"), damit kein Widerspruch zum Ersatzteil-Hinweis in
   derselben Sektion entsteht.

3. **"Zuletzt bestätigt durch das CO2-neutrale Werk Sulgen, die modernste
   Kühlgerätefabrik Europas" rahmt eine Herstellerwerbeaussage stärker als
   objektiven Fakt, als es die eigene Quelle im Research tut.**
   Was: `research.md` (Abschnitt 4) markiert "modernste Kühlgerätefabrik
   Europas" explizit als **von V-ZUG selbst beworbene** Aussage ("von V-ZUG
   als 'modernste Kühlgerätefabrik Europas' beworben"). Der Content-Entwurf
   übernimmt zwar denselben Wortlaut (keine neue Zahl, kein neues Faktum),
   verpackt ihn aber neu als "zuletzt bestätigt durch" – eine
   Formulierung, die suggeriert, es handle sich um eine extern verifizierte
   Bestätigung der Qualitätsaussage "V-ZUG steht seit 1913 für Schweizer
   Qualität", statt um eine Eigenwerbung des Herstellers.
   Warum problematisch: Das ist zwar kein neu erfundenes Faktum (die Aussage
   steht so bereits im Bestandscode, `index.astro` Zeile 194), aber die
   sprachliche Umrahmung im Entwurf verstärkt einen unbelegten Superlativ
   gerade an der Stelle, an der der Auftrag ausdrücklich "keine unbelegten
   Superlative" fordert. Der Entwurf hatte hier die Chance, die vom Research
   selbst empfohlene Vorsicht (Herkunft als Werbeaussage kenntlich machen)
   umzusetzen, tut aber das Gegenteil.
   Verbesserungsvorschlag: "zuletzt bestätigt durch" streichen bzw. durch
   eine neutralere Formulierung ersetzen (z. B. "dazu zählt auch das
   CO2-neutrale Werk Sulgen …", ohne Bestätigungs-Rhetorik), damit die
   Aussage erkennbar Herstellerkommunikation bleibt statt wie eine
   unabhängige Bestätigung zu klingen.

## Kleinere Anmerkungen

- Auf `ueber-uns.astro` stehen nach Umsetzung zwei sehr ähnlich klingende,
  aber unterschiedliche Alters-Behauptungen nah beieinander: "Seit fast 100
  Jahren im Rheintal" (Kicker, bezieht sich auf Elektro Breitenmoser) und
  "die V-ZUG seit über 100 Jahren auszeichnet" (V-ZUG-Block, bezieht sich auf
  V-ZUG). Beide Firmen sind sachlich klar getrennt benannt, aber die fast
  identische Formulierung ("fast 100" vs. "über 100 Jahre") auf derselben
  Seite kann bei flüchtigem Lesen zur Verwechslung führen, wer hier gemeint
  ist. Eine bewusst unterschiedlichere Formulierung für die V-ZUG-Aussage
  (z. B. "seit ihrer Gründung 1913") würde das entschärfen.
- Der Entwurf weicht bei der Vertrauensleiste bewusst von der
  Design-Spec-Formulierung ("Lieferung Schweizweit") zu "Lieferung in die
  ganze Schweiz" ab. Die Begründung (Konsistenz mit der Service-Sektion) ist
  nachvollziehbar, aber es handelt sich um eine unilaterale Abweichung von
  einer expliziten Design-Spec-Vorgabe, die im Text nicht als
  Rücksprachebedarf mit `ui-ux-designer` markiert ist.
- Die Meta-Description der Startseite ("persönliche Beratung, Verkauf,
  Lieferung und Installation – seit fast 100 Jahren im Rheintal") reiht vier
  Substantive aneinander – inhaltlich korrekt, aber an der Grenze zur
  Keyword-Aneinanderreihung statt eines lesbaren Satzes; das ist Aufgabe von
  `seo-specialist`, wird hier nur vermerkt.

## Was funktioniert gut

- Die Selbstbeschränkung "keine neuen Fakten" wird im engeren Sinn
  eingehalten: keine erfundenen Kundenzahlen, Auszeichnungen oder
  Gründungsjahre; TODO-Platzhalter in der Zeitleiste bleiben unangetastet.
- Terminologie-Vereinheitlichung (Fachhändler/Regionalpartner-Trennung,
  "Lieferung in die ganze Schweiz" statt Versand/Lieferung-Mischung) ist
  konsequent durchgezogen und nachvollziehbar begründet.
- Die Trennung "Vertrauensleiste = kompakte Aufzählung" vs.
  "Regionalpartner-Karte = Erklärung" vermeidet die inhaltliche Dopplung, die
  die Design-Spec explizit als Risiko benannt hatte.
- Der Ersatzteil-Hinweis (kein Direktverkauf ab Lager) bleibt unverändert
  sichtbar – wichtig für Segment C laut Research, wird nicht zugunsten
  eines glatteren Verkaufstexts weggelassen.
- Tonalität durchgehend sachlich, kurze Sätze, keine Anglizismen oder
  Jugend-/Trend-Slang – passt zur im Research beschriebenen konservativen,
  traditionsbewussten Zielgruppe.
