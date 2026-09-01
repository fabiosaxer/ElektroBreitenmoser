# SEO-Analyse: vzugshop.ch (frischer Vollaudit)

**Datum:** 2026-09-01
**Geprüft:** `https://www.vzugshop.ch/`, `/ueber-uns/`, `/geraeteanfrage/`, `/impressum/`, `/datenschutz/`, `/danke/`, `/robots.txt`, `/sitemap.xml`, `/_astro/*` — per `curl` direkt gegen den Produktionsserver, abgeglichen mit `src/layouts/Layout.astro`, `src/pages/*.astro`, `src/components/*.astro`, `src/data/appliances.ts`, `src/styles/global.css`, `astro.config.mjs`. Zusätzlich Stichproben-Vergleich mit `weber-haushaltgeraete.ch` und `bichler.ch` sowie Websuche zu Verzeichnis-Einträgen (local.ch, search.ch, hellopage.ch).

**Ausgangslage:** Laut `docs/live-audit-seo.md`/`docs/live-audit-summary.md` bereits behoben und in diesem Audit **verifiziert, dass es hält**: Sitemap-Trailing-Slashes, interne Links mit Trailing Slash, OG-/Twitter-Card-Tags inkl. `og-default.jpg`, Security-Header bei echten GET-Requests (jetzt via Plesk-Header korrekt ausgeliefert), Cache-Control für `/_astro/`-Assets (`public, max-age=31536000, immutable`), Hero-Bild-Kompression (`quality={75}`, 1600w-WebP jetzt 315 KB statt vormals ~1.49 MB), `/danke/`-Redirect-Ziel mit Trailing Slash und korrektem `noindex`. Diese Punkte werden unten nicht erneut als offene Massnahme geführt, nur kurz als "verifiziert" bestätigt.

---

## Priorisierte Massnahmenliste

### Kritisch

**K1 — Alias-Domain `elektrobreitenmoser.ch` redirected nicht, sondern läuft als eigenständige alte Website weiter**

`astro.config.mjs` dokumentiert explizit die Absicht: *"elektrobreitenmoser.ch und vzug-spezialist.ch sind Alias-Domains, die per DNS/Hosting-Redirect auf diese Domain zeigen sollen (301, damit Google nur eine Version indexiert)"*. Live-Check zeigt das Gegenteil:

```
$ curl -sk -D - -o /dev/null https://www.elektrobreitenmoser.ch/
HTTP/2 200
title: "Elektro Breitenmoser AG - Solar, Elektro, V-Zug Spezialist, Rebstein, Marbach, Rheintal"
(WordPress, x-pingback: https://www.elektrobreitenmoser.ch/xmlrpc.php)

$ curl -sk -D - -o /dev/null https://vzug-spezialist.ch/
HTTP/2 301 → https://www.elektrobreitenmoser.ch/   (NICHT vzugshop.ch!)
```

Die alte WordPress-Seite ist voll erreichbar, crawlbar (`robots.txt` dort erlaubt alles ausser `/wp-admin/`, kein `noindex`) und zeigt komplett andere Inhalte/Struktur als `vzugshop.ch`. Öffentliche Verzeichnisse (search.ch, local.ch-Betriebseintrag laut Websuche) nennen weiterhin `www.elektrobreitenmoser.ch` als Website-URL des Unternehmens — das ist vermutlich die historisch bekanntere Domain. Effekt:

- **Doppelte Web-Präsenz derselben Firma** mit unterschiedlichem Content, unterschiedlicher NAP-Darstellung und unterschiedlichem Branding — Verwirrung für Nutzer, die über Verzeichnis-Einträge oder alte Backlinks auf die veraltete Seite gelangen.
- **Backlink-/Citation-Equity fliesst nicht zu `vzugshop.ch`.** Jeder externe Verweis (Verzeichnisse, ggf. alte Google-Business-Profil-Verlinkung) auf `elektrobreitenmoser.ch` stärkt Google-seitig die falsche Domain statt der aktuellen.
- **Kein Duplicate-Content-Schutz:** Ohne `noindex`/Redirect kann Google beide Domains parallel indexieren und im schlechteren Fall die alte WordPress-Seite als "die" Website des Unternehmens werten.

**Fix (kein Repo-Fix — Hosting/DNS, gleiche Kategorie wie der offene `www`→Apex-Punkt unten):**
1. Bei Daniel Benz/Hosting-Verantwortlichem klären, wer `elektrobreitenmoser.ch` und `vzug-spezialist.ch` aktuell hostet (vermutlich separates altes WordPress-Hosting, nicht dasselbe Plesk wie `vzugshop.ch`).
2. Beide Domains serverseitig als 301-Redirect auf `https://vzugshop.ch/` umbiegen (analog zum in `docs/live-audit-seo.md` Abschnitt 1.2 vorgeschlagenen Muster), inklusive Pfad-Erhalt (`$request_uri`) wo Altseiten-URLs bekannt sind.
3. Google Search Console für beide Alt-Domains einrichten (sofern Zugriff besteht) und "Adressänderung"/Redirect dort bestätigen, damit Google die Signal-Konsolidierung nachvollzieht.
4. Google-Unternehmensprofil (siehe L1 unten) und alle Verzeichniseinträge (local.ch, search.ch, hellopage.ch) auf `vzugshop.ch` aktualisieren.

Das ist die mit Abstand wichtigste Einzelmassnahme dieses Audits — sie betrifft die Domain-/Markenkonsolidierung als Ganzes, nicht nur eine einzelne Seite.

---

### Wichtig

**W1 — `www.vzugshop.ch` liefert weiterhin 200 ohne 301 auf die kanonische Apex-Domain**

Weiterhin offen (bereits in `docs/live-audit-summary.md` Finding #3 dokumentiert, Timing war "nach DNS-Propagationscheck"). Heutiger Live-Check:

```
$ curl -sk -o /dev/null -w "%{http_code}" https://vzugshop.ch/
200
$ curl -sk -o /dev/null -w "%{http_code}" https://www.vzugshop.ch/
200
$ dig +short vzugshop.ch @8.8.8.8       → 80.74.142.125
$ dig +short www.vzugshop.ch @8.8.8.8   → 80.74.142.125
```

DNS ist jetzt sauber propagiert (beide Hosts lösen korrekt auf), die Apex-Domain ist erreichbar — der DNS-Propagationscheck aus dem letzten Audit ist damit bestanden. Der `www`→Apex-301 kann jetzt gefahrlos aktiviert werden (Snippet siehe `docs/live-audit-summary.md` Abschnitt 4.3, Plesk "Preferred Domain" bevorzugt). Bis dahin bleibt das Duplicate-Content-/Crawl-Budget-Risiko zwischen `vzugshop.ch` und `www.vzugshop.ch` bestehen (Canonical-Tag zeigt zwar korrekt auf Apex, das ersetzt aber keinen echten Host-Redirect).

**W2 — JSON-LD `LocalBusiness`: Subtyp, Foto und Geo-Signale fehlen weiterhin**

Aktuelles Markup (verifiziert, syntaktisch valide):

```json
{
  "@type": "LocalBusiness",
  "name": "Elektro Breitenmoser AG",
  "image": "https://vzugshop.ch/logo.png",
  ...
  "sameAs": ["https://www.instagram.com/breitenmoserag_vzug/"]
}
```

Drei konkrete Verbesserungen, alle risikofrei und in `src/layouts/Layout.astro` umsetzbar:

1. **`@type: "ElectronicsStore"`** statt generischem `LocalBusiness` — treffendere Kategorisierung für ein Verkaufsgeschäft (Subtyp von `LocalBusiness`, keine Breaking Change für bestehende Rich-Result-Eligibility).
2. **`image` auf echtes Standort-/Showroom-Foto statt Logo.** Google empfiehlt für `LocalBusiness` ein reales Foto der Räumlichkeiten, kein reines Logo — `hero-standort.jpg` oder ein Showroom-Bild ist bereits vorhanden und passend:
   ```js
   image: [
     new URL('/og-default.jpg', Astro.site).toString(),
   ],
   ```
3. **`geo`-Koordinaten ergänzen** (Fortunastrasse 2, 9437 Marbach lässt sich einmalig über Google Maps nachschlagen) — verbessert die Eignung für lokale Karten-Rich-Results:
   ```json
   "geo": { "@type": "GeoCoordinates", "latitude": 47.290, "longitude": 9.524 }
   ```
   (Platzhalterwerte — exakte Koordinaten vor Einbau verifizieren, z. B. über den Rechtsklick-Punkt in Google Maps.)
4. Optional: `priceRange: "$$$"` (Premium-Segment, passt zu V-ZUG) und `hasMap` mit dem Google-Maps-Link, der bereits im Footer verwendet wird.

**W3 — Kein Google-Unternehmensprofil-Link auf der Website, keine Google Search Console erkennbar**

Der Footer verlinkt auf eine generische Google-Maps-Suchanfrage (`google.com/maps/search/?api=1&query=...`), nicht auf ein bestätigtes Google-Unternehmensprofil (GBP, vormals "Google My Business"). Für ein lokales Fachgeschäft im Rheintal ist ein gepflegtes, verlinktes GBP-Profil (mit Öffnungszeiten-Hinweis "nach Vereinbarung", Fotos, Kategorie "Elektrogeschäft"/"Haushaltsgerätegeschäft", Bewertungen) einer der stärksten lokalen Rankingfaktoren überhaupt — stärker als jedes On-Page-Signal. Zusätzlich wurde bei der Live-Prüfung **keine Google Search Console-Verifizierung** (weder Meta-Tag noch DNS-Hinweis erkennbar) und **keine Analytics-Einbindung** gefunden — Letzteres ist laut `datenschutz.astro` ("Diese Website setzt aktuell keine Analyse-/Tracking-Tools ein") eine bewusste Entscheidung und muss nicht geändert werden, aber Search Console **funktioniert ohne Cookies/Tracking** (DNS-TXT- oder HTML-Datei-Verifizierung) und sollte unabhängig davon eingerichtet werden, sonst fehlt jede Sichtbarkeit auf Crawling-Fehler, Suchanfragen und Klickzahlen.

**Empfehlung:**
- Google-Unternehmensprofil für `vzugshop.ch` beanspruchen/aktualisieren (Website-Feld auf `https://vzugshop.ch`, nicht `elektrobreitenmoser.ch` — siehe K1), Kategorie "Haushaltsgerätegeschäft" oder "Elektrofachgeschäft", Fotos vom Showroom hochladen.
- Footer-Link von der Maps-Suchanfrage auf den direkten GBP-Eintrag (Place-ID-Link) umstellen, sobald vorhanden — erleichtert Nutzern das Hinterlassen einer Bewertung.
- Google Search Console für `vzugshop.ch` (Property-Typ "Domain") einrichten und `sitemap.xml` dort einreichen.

**W4 — Dünne Textbasis auf den umsatzrelevanten Seiten**

Wortanzahl je Seite (automatisiert ausgezählt, sichtbarer Fliesstext ohne Markup):

| Seite | Wörter |
|---|---|
| `/` | 339 |
| `/ueber-uns/` | 252 |
| `/geraeteanfrage/` | 175 |
| `/impressum/` | 86 |
| `/datenschutz/` | 603 |

Für die Startseite und `/ueber-uns/` ist das für ein Fachgeschäft mit differenziertem Sortiment (11 Küchengeräte-Kategorien + 3 Waschküche-Kategorien laut `src/data/appliances.ts`) eher knapp — Google hat wenig Fliesstext, um thematische Tiefe und Relevanz für Long-Tail-Suchbegriffe (siehe Abschnitt Content-SEO) zu erkennen. Kein Grund für künstliches "Keyword-Stuffing", aber die in Abschnitt 3 vorgeschlagenen Content-Ergänzungen (Gerätekategorie-Absätze, FAQ) würden das gleichzeitig lösen.

---

### Nice-to-have

**N1 — HSTS ohne `preload`-Flag**
Wie in `docs/live-audit-summary.md` Finding #9 bereits vermerkt: aktuell `max-age=31536000; includeSubDomains` ohne `preload`. Kein SEO-Ranking-Effekt, leichtes Trust-/Security-Plus. Nur nach bewusster Kundenentscheidung einreichen (hstspreload.org-Eintrag ist praktisch nicht rückgängig zu machen).

**N2 — `lastmod` in der Sitemap einheitlich statt seitenspezifisch**
Weiterhin wie zuvor dokumentiert: alle fünf URLs tragen dasselbe Datum (Build-/Deploy-Datum). Kein Fehler, aber langfristig aussagekräftiger, wenn sich Seiten unterschiedlich oft ändern.

**N3 — Fehlende `FAQPage`-Strukturierte-Daten**
Für wiederkehrende Fragen ("Verkaufen Sie Ersatzteile ab Lager?", "Liefern Sie in die ganze Schweiz?", "Muss ich einen Termin vereinbaren?") würde sich ein FAQ-Abschnitt mit `FAQPage`-JSON-LD anbieten — sowohl für Rich-Snippet-Potenzial als auch um genau die Erwartungsmanagement-Punkte aus `docs/research.md` (kein Ersatzteil-Direktverkauf, Besuch nur nach Vereinbarung) proaktiv und suchmaschinenfreundlich zu adressieren. Kein akuter Bedarf, aber naheliegende Ergänzung zu W4.

**N4 — "Steamer" vs. "Dampfgarer" als Suchbegriff-Synonym**
`src/data/appliances.ts` nennt die Kategorie nur "Steamer" (V-ZUG-Markenbegriff); `docs/research.md`s Fachvokabular führt "Kombi-Dampfgarer/Steamer" als Doppelbegriff. Deutschschweizer Nutzer suchen teils nach "Dampfgarer", nicht nach "Steamer" — ein ergänzender Nebensatz auf der Startseite oder in der Geräteanfrage ("Steamer (Dampfgarer)") würde diese Suchintention zusätzlich abdecken, ohne die V-ZUG-Terminologie zu verlieren.

---

## 1. Technisches SEO

**Crawlbarkeit/Indexierbarkeit — sauber:**
- `robots.txt` (verifiziert über `www.vzugshop.ch/robots.txt`): `User-agent: * / Allow: /`, korrekter `Sitemap:`-Verweis auf `https://vzugshop.ch/sitemap.xml`.
- `sitemap.xml`: alle fünf Seiten mit Trailing Slash (Fix aus letztem Audit hält), `lastmod`/`changefreq`/`priority` gesetzt.
- Kein `noindex` auf den fünf öffentlichen Seiten; `/danke/` korrekt mit `<meta name="robots" content="noindex, nofollow">` versehen (Formular-Dankesseite soll nicht indexiert werden — richtig umgesetzt).
- `<html lang="de-CH">` korrekt gesetzt.
- HTTP→HTTPS-Redirect funktioniert (`http://www.vzugshop.ch/` → 301).

**Canonical-Tags — korrekt und konsistent:**
Alle fünf Seiten liefern (Live-Check via `www`-Host) einen Canonical auf die **nicht-www-Apex-Domain** mit Trailing Slash, exakt passend zur `sitemap.xml` und zu `astro.config.mjs`s `site: 'https://vzugshop.ch'`:

| Seite | Canonical |
|---|---|
| `/` | `https://vzugshop.ch/` |
| `/ueber-uns/` | `https://vzugshop.ch/ueber-uns/` |
| `/geraeteanfrage/` | `https://vzugshop.ch/geraeteanfrage/` |
| `/impressum/` | `https://vzugshop.ch/impressum/` |
| `/datenschutz/` | `https://vzugshop.ch/datenschutz/` |

**Strukturierte Daten (JSON-LD) — valide, aber ausbaufähig:**
Per Python (`json.loads`) gegen das live ausgelieferte `<script type="application/ld+json">` geprüft: syntaktisch fehlerfrei, `@type: LocalBusiness` mit `name`, `image`, `url`, `telephone`, `email`, `taxID`, vollständiger `address` (PostalAddress), `areaServed` (Rheintal), `sameAs` (Instagram). Verbesserungsvorschläge siehe **W2** oben (Subtyp `ElectronicsStore`, echtes Foto statt Logo, `geo`-Koordinaten, `priceRange`).

**Ladezeit-relevante Faktoren:**
- HTML wird Brotli-komprimiert ausgeliefert (`content-encoding: br`), Startseite ca. 6.3 KB komprimiert.
- Hero-Bild: responsive `srcset` mit drei Breakpoints (640/1024/1600w) als WebP, `quality={75}`, `fetchpriority="high"`/`loading="eager"` korrekt nur auf dem LCP-Bild gesetzt. 1600w-Variante jetzt 315 KB (vormals laut Vorgänger-Audit ~1.49 MB unkomprimiert) — die im letzten Audit dokumentierte Massnahme hält in Produktion.
- `/_astro/`-Assets (CSS/JS, contentgehasht) liefern `Cache-Control: public, max-age=31536000, immutable`; HTML liefert korrekt `no-cache` (kein Caching von veraltetem HTML). Security-Header (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) kommen bei echten GET-Requests konsistent auf Apex und `www` an — der im letzten Audit dokumentierte Plesk-Fix hält.
- Keine externen Font- oder Analytics-Requests, die Ladezeit/Datenschutz beeinträchtigen würden (bewusste Design-Entscheidung laut `datenschutz.astro`).

**Mobile-Friendliness (Code-Review):**
- `<meta name="viewport" content="width=device-width, initial-scale=1">` auf allen Seiten vorhanden.
- Tailwind-Utility-Klassen mit durchgängigen `sm:`/`md:`/`lg:`-Breakpoints in allen geprüften Komponenten (`Header.astro`, `index.astro`, `ueber-uns.astro`, `geraeteanfrage.astro`) — keine fixen Pixel-Breiten ausserhalb responsiver Container gefunden.
- Mobiles Hamburger-Menü in `Header.astro` mit korrekten `aria-expanded`/`aria-controls`-Attributen.
- `global.css` enthält nur Tailwind-Import und Farbvariablen (`@theme`), keine Layout-Overrides, die mobile Darstellung gefährden könnten.

**Offene technische Punkte:** siehe K1 (Alias-Domains) und W1 (`www`→Apex-Redirect) oben.

---

## 2. On-Page-SEO

**Title-Tags** (alle im 35–60-Zeichen-Korridor, pro Seite eindeutig, konsistentes Suffix-Muster `· Elektro Breitenmoser AG`):

| Seite | Title | Länge |
|---|---|---|
| `/` | V-ZUG Fachhändler Marbach · Elektro Breitenmoser AG | 51 |
| `/ueber-uns/` | Über uns – V-ZUG Regionalpartner · Elektro Breitenmoser AG | 58 |
| `/geraeteanfrage/` | V-ZUG Geräteanfrage Marbach · Elektro Breitenmoser AG | 53 |
| `/impressum/` | Impressum · Elektro Breitenmoser AG | 35 |
| `/datenschutz/` | Datenschutz · Elektro Breitenmoser AG | 37 |

Klar formuliert, differenziert, Haupt-Keyword ("V-ZUG Fachhändler"/"V-ZUG Geräteanfrage"/"V-ZUG Regionalpartner") jeweils vorne platziert. Kein Handlungsbedarf.

**Meta-Descriptions:** alle im Zielkorridor (108–154 Zeichen), einzigartig, mit Call-to-Action-Charakter ("berät Sie persönlich", "unverbindliche Geräteanfrage"). Kein Handlungsbedarf.

**Heading-Struktur:**
- Genau ein `<h1>` pro Seite, thematisch passend ("Ihr V-ZUG Fachhändler in Marbach", "Über uns", "Geräteanfrage", "Impressum", "Datenschutzerklärung").
- `<h2>`-Anzahl: `/` 5, `/ueber-uns/` 8 (inkl. Timeline-Meilensteine als eigene H2-Ebene — siehe unten), `/geraeteanfrage/` 1, `/impressum/` 0, `/datenschutz/` 8.
- **Kleiner struktureller Punkt:** In `ueber-uns.astro` sind die sechs Timeline-Einträge (1933–Heute) als `<h2>` ausgezeichnet (Zeile 93: `<h2 class="mt-1 text-lg ...">{m.title}</h2>`), während die beiden Folgeabschnitte "V-ZUG seit 1913" und "Bereit für Ihr Projekt?" ebenfalls `<h2>` sind. Das ist nicht falsch (alle sind sinnvolle Sektionsüberschriften auf gleicher Ebene), aber semantisch sauberer wäre, die Timeline-Jahreszahlen als `<h3>` unter einer gemeinsamen `<h2>` ("Unsere Geschichte") zu führen — rein strukturelle Politur, kein Ranking-Risiko.

**Alt-Texte:** Stichprobe über alle `<img>`-Tags auf `/`, `/ueber-uns/`, `/geraeteanfrage/` ergab **100 % Abdeckung** (10/10, 4/4, 1/1) — alle Alt-Texte sind beschreibend und nicht generisch (z. B. "V-ZUG Kücheninsel mit Kühlschrank und Backöfen im Showroom" statt "Bild1.jpg"). Kein Handlungsbedarf.

**Interne Verlinkung:**
- Hauptnavigation (`Header.astro`) verlinkt konsistent Start/Über uns/Geräteanfrage, mit `aria-current="page"` für aktiven Zustand.
- Homepage verlinkt jede der 14 Gerätekategorien direkt in die Geräteanfrage mit vorausgefülltem `?geraet=`-Parameter (`/geraeteanfrage/?geraet=steamer` etc.) — gute Konversions-nahe interne Verlinkung, aber **keine dieser 14 Kategorien hat eine eigene indexierbare URL/Landingpage** (alle Links laufen in `/geraeteanfrage/` mit Query-Parameter). Das ist für die Nutzerführung sinnvoll, bedeutet aber SEO-seitig, dass es keine spezifische Zielseite gibt, die z. B. für "V-ZUG Waschturm kaufen Rheintal" ranken könnte (siehe Content-SEO Abschnitt 3).
- Footer verlinkt korrekt auf Impressum/Datenschutz sowie eine Google-Maps-Route.
- Fehlende Gelegenheit: Von `/ueber-uns/` gibt es keinen Link zurück zu spezifischen Gerätekategorien oder zur Geräteanfrage mit Kontext (nur ein generischer "Geräteanfrage stellen"-Button am Seitenende) — thematische Querverlinkung (z. B. "unsere Photovoltaik-Partnerschaft" aus `docs/research.md` wird auf der Website gar nicht erwähnt) bleibt ungenutzt.

**URL-Struktur:** durchgängig sprechend, kurz, Kleinschreibung, Trailing Slash konsistent (`/ueber-uns/`, `/geraeteanfrage/`, `/impressum/`, `/datenschutz/`) — vorbildlich.

---

## 3. Content-SEO & Keyword-Fokus

Abgleich mit den in `docs/research.md` Abschnitt 4 genannten Keyword-Kandidaten (automatisierte Häufigkeitszählung über den live ausgelieferten Text aller fünf Seiten):

| Begriff | Vorkommen (gesamt) |
|---|---|
| Marbach | 54 |
| Rheintal | 25 |
| Regionalpartner | 12 |
| Fachhändler | 11 |
| Kochfelder | 6 |
| Geschirrspüler | 3 |
| Weinkühlschrank | 3 |
| Waschtürme | 2 |
| Kühlschrank | 2 |
| Service | 1 |
| St. Gallen / Ostschweiz | 0 |
| Reparatur | 0 |
| Ratgeber / Blog | 0 |

**Bewertung:** Die Kernbegriffe "Marbach", "Rheintal", "Fachhändler", "Regionalpartner" sind natürlich in den Fliesstext eingebettet (keine künstliche Häufung, gute Lesbarkeit) — das deckt die in `docs/research.md` priorisierten Haupt-Suchintentionen ("V-ZUG Fachhändler Rheintal/Marbach") plausibel ab. Die dort ebenfalls genannten Long-Tail-Kandidaten rund um einzelne Gerätekategorien plus Region (z. B. "V-ZUG Waschturm kaufen Rheintal", "V-ZUG Geschirrspüler Rheintal") sind **nicht abgedeckt**, weil diese Kategorien nur als Button-Label ohne umgebenden Fliesstext existieren (siehe Abschnitt 2, interne Verlinkung).

**Konkrete Content-Lücken (5, priorisiert nach vermutetem Aufwand/Nutzen-Verhältnis):**

1. **Fehlende Landingpages/Absätze je Gerätekategorie.** Die 14 Kategorien aus `src/data/appliances.ts` (Waschtürme, Steamer, Kochfelder, Geschirrspüler, Kühl-/Gefrierschränke etc.) haben keinen eigenen, crawlbaren Content-Abschnitt. Schon 2–3 Sätze pro Kategorie auf der Startseite (z. B. unter jedem `<h3>`-Gerätebereich ein kurzer Beschreibungstext mit Region+Keyword, "V-ZUG Waschtürme für Ihren Waschraum im Rheintal – wir beraten Sie zu Kapazität und Einbaumassen") würden die in `docs/research.md` explizit genannten Long-Tail-Kandidaten ohne separate Seiten abdecken. Grössere Ausbaustufe: eigene Kategorie-Seiten (`/kochen/`, `/waschen/` o. Ä.) — höherer Aufwand, aber stärkeres SEO-Potenzial.
2. **Kein Ratgeber-/FAQ-Content.** Weder Blog noch FAQ-Bereich vorhanden (0 Treffer für "Ratgeber"/"Blog"). Für eine Zielgruppe, die laut `docs/research.md` "Termintreue", "Kompatibilität mit Küchenplanung" und Erwartungsmanagement zum Ersatzteil-Thema braucht, wäre ein kompakter FAQ-Block (kombiniert mit N3 oben) ein naheliegender erster Schritt ohne Blog-Infrastruktur.
3. **Regionale Suchbegriffe über "Rheintal"/"Marbach" hinaus fehlen.** "St. Gallen" und "Ostschweiz" kommen 0-mal vor, obwohl `docs/research.md` das Einzugsgebiet ausdrücklich weiter fasst (Wettbewerbsvergleich nennt Wil, St. Gallen, Toggenburg als Nachbarregionen) und Lieferung "in die ganze Schweiz" ohnehin beworben wird. Eine ergänzende Erwähnung wie "…beraten Kundschaft aus dem ganzen Rheintal bis St. Gallen und Appenzell" würde den geografischen Suchradius realistisch erweitern, ohne zu übertreiben.
4. **Swiss-Made-/V-ZUG-Werk-Sulgen-Story wird angerissen, aber nicht suchmaschinenrelevant vertieft.** Der Abschnitt "V-ZUG Regionalpartner" auf der Startseite und "V-ZUG seit 1913" auf `/ueber-uns/` erwähnen Werk Sulgen und CO2-Neutralität bereits (gute Ansätze, siehe `docs/research.md` Abschnitt 4) — das sind aber nur 2–3 Sätze. Ein eigener, etwas ausführlicherer Absatz zu "Swiss Made"/Nachhaltigkeit (Suchintention: umweltbewusste Käuferschicht, Trend laut Research bestätigt) würde diesen bereits vorhandenen Content-Ansatz vertiefen, ohne neue Seiten zu benötigen.
5. **Photovoltaik-Nebengeschäft fehlt auf der Website komplett.** `docs/research.md` nennt explizit "Photovoltaik-Anlagen (Partnerschaft mit Jansen AG, Oberriet)" als zweites Standbein und die Timeline in `ueber-uns.astro` erwähnt es sogar ("mit Photovoltaik-Anlagen als weiterem Standbein" im letzten Meilenstein) — es gibt aber keinen eigenen Abschnitt, keine Erwähnung auf der Startseite und keinen Kontaktweg dafür. Falls das Geschäftsfeld aktiv weitergeführt wird, ist das sowohl inhaltlich (zusätzliches Angebot) als auch SEO-seitig (zusätzliche, unkonkurrenzierte Suchbegriffe wie "Photovoltaik Rheintal Marbach") eine ungenutzte Gelegenheit. Falls es inzwischen eingestellt wurde, sollte der Timeline-Satz entsprechend geprüft werden.

---

## 4. Lokales SEO

**NAP-Konsistenz (Name/Adresse/Telefon) — innerhalb der Website vorbildlich:**

| Feld | JSON-LD | Footer | Impressum | Geräteanfrage-Seite |
|---|---|---|---|---|
| Name | Elektro Breitenmoser AG | Elektro Breitenmoser AG | Elektro Breitenmoser AG | — |
| Adresse | Fortunastrasse 2, 9437 Marbach, SG, CH | Fortunastrasse 2, CH-9437 Marbach | Fortunastrasse 2, CH-9437 Marbach | Fortunastrasse 2, CH-9437 Marbach |
| Telefon | +41717771276 | 071 777 12 76 | 071 777 12 76 | (nur Kartenlink) |
| E-Mail | info@vzugshop.ch | info@vzugshop.ch | info@vzugshop.ch | — |

Alle vier Quellen stimmen exakt überein (Telefonformat E.164 im JSON-LD vs. Schweizer Schreibweise im sichtbaren Text ist Standardpraxis, kein Widerspruch). Kein Handlungsbedarf innerhalb der Website selbst.

**NAP-Konsistenz nach aussen — hier liegt das eigentliche Problem (siehe K1):** Externe Verzeichnisse (local.ch, search.ch laut Websuche) führen weiterhin `www.elektrobreitenmoser.ch` als Website-URL, nicht `vzugshop.ch`. Das ist kein Adress-/Telefon-Widerspruch, aber ein **Website-URL-Widerspruch**, der die Domain-Konsolidierung aus K1 zusätzlich untermauert: Solange Verzeichnisse auf die alte Domain verweisen, wird ein Teil des lokalen Suchverkehrs weiterhin auf die veraltete Seite geleitet statt auf `vzugshop.ch`.

**Google-Unternehmensprofil:** Kein direkter Verweis von der Website auf ein Google-Unternehmensprofil (siehe W3). Ohne Zugriff auf ein internes GBP-Dashboard lässt sich der Status (beansprucht? aktuell? Website-Feld korrekt?) von aussen nicht abschliessend prüfen — Empfehlung: das gehört als Erstes geklärt, bevor weitere lokale Massnahmen sinnvoll sind, da GBP-Sichtbarkeit ("Local Pack") für ein Geschäft mit "Besuch nur nach Vereinbarung" (kein Laufkundschafts-Modell) eine der wenigen verlässlichen Quellen für neue lokale Anfragen ist.

**Bewertungs-/Trust-Signale:** Laut `docs/research.md` existiert mindestens eine 5-Sterne-Bewertung auf local.ch (19.05.2025) sowie eine 6,5/10-Aggregatbewertung auf hellopage.ch (2 Rezensionen, Einzeltexte nicht mehr abrufbar) — auf der Website selbst wird **keine dieser Bewertungen sichtbar gemacht** (kein Testimonial-Abschnitt, kein Bewertungs-Widget, kein Link "Bewerten Sie uns"). Für eine Zielgruppe, die laut Research überdurchschnittlich Wert auf Vertrauen/Kontinuität legt, ist das eine ungenutzte Gelegenheit — sofern die Bewertungstexte vom Kunden freigegeben werden, wäre ein kurzer Zitat-Block auf `/ueber-uns/` oder der Startseite (mit Verweis/Link auf das Original auf local.ch, keine Erfindung neuer Bewertungen) ein einfacher Trust-Booster. Kein technischer Fix, sondern eine redaktionelle Ergänzung — ausdrücklich **keine Empfehlung**, `aggregateRating`/`review` im JSON-LD zu ergänzen, ohne dass die Bewertungsplattform das selbst unterstützt bzw. der Text verifizierbar bleibt (Google-Richtlinien zu selbst-gehosteten Bewertungs-Snippets sind hier streng).

**Lokale Keyword-Abdeckung:** siehe Abschnitt 3 — "Marbach"/"Rheintal" gut abgedeckt, "St. Gallen"/"Ostschweiz" als Erweiterung des Einzugsgebiets fehlt.

---

## 5. Wettbewerbsvergleich (kurz)

Stichprobenvergleich der beiden laut `docs/research.md` direktesten Verkaufs-Wettbewerber:

| Kriterium | vzugshop.ch | weber-haushaltgeraete.ch | bichler.ch |
|---|---|---|---|
| Strukturierte Daten | `LocalBusiness` mit vollständiger NAP, valide | **keine** (0 `application/ld+json`-Vorkommen gefunden) | Generisches Yoast-`Organization`/`WebSite`-Schema, keine `LocalBusiness`/NAP-Daten |
| Title-Tag | Klar, Keyword vorne, Marken-Suffix | "Weber Haushaltgeräte - V-ZUG Produkte für Küche Waschraum" (ähnliches Muster) | "Bichler + Partner AG \| Gebäudetechnik, Informatik, Automation, Hausgeräte …" (breiter, weniger V-ZUG-fokussiert) |
| Blog/Ratgeber-Content | keiner | keiner (Stichprobe Startseite) | keiner (Stichprobe Startseite) |
| Domain-Konsolidierung | **Problematisch** (siehe K1: Alt-Domain aktiv) | nicht geprüft | nicht geprüft |

**Einschätzung:** Technisch-strukturell liegt `vzugshop.ch` bereits **vor** Weber (kein JSON-LD dort) und vor Bichler (nur generisches Schema ohne lokale NAP-Daten) — die in den letzten Audits umgesetzten Fixes (OG-Tags, Security-Header, Performance, valides LocalBusiness-Schema) sind kein Nachholbedarf gegenüber diesen beiden Wettbewerbern, sondern bereits ein Vorsprung. Der einzige Bereich, in dem `vzugshop.ch` aktuell schlechter dasteht als eine "saubere" Single-Domain-Strategie, ist die in K1 beschriebene Domain-Fragmentierung — das ist kein Wettbewerbsnachteil im Vergleich zu Weber/Bichler (deren Domain-Situation wurde nicht geprüft), sondern ein hausgemachtes, lösbares Problem. Content-seitig (Blog/Ratgeber) sind alle drei Seiten auf ähnlichem, eher knappem Niveau — hier böte sich für `vzugshop.ch` die Chance, sich mit den in Abschnitt 3 vorgeschlagenen Content-Ergänzungen abzusetzen, ohne dass ein Wettbewerber das bereits vorweggenommen hätte.

---

## Anhang: Rohdaten-Belege (Kurzreferenz)

- JSON-LD-Validierung: `python3 -c "import json,re; ..."` gegen live ausgeliefertes `<script type="application/ld+json">` → syntaktisch fehlerfrei, siehe Abschnitt 1.
- Security-/Cache-Header: `curl -sk -D - -o /dev/null https://www.vzugshop.ch/` und `.../_astro/Layout.pC20WPNu.css` → alle sechs Security-Header + `Cache-Control: public, max-age=31536000, immutable` auf `/_astro/` bestätigt.
- Alias-Domains: `curl -sk -D - -o /dev/null -L https://www.elektrobreitenmoser.ch/` (HTTP 200, WordPress) und `https://vzug-spezialist.ch/` (301 → `elektrobreitenmoser.ch`, nicht `vzugshop.ch`).
- Wortanzahl/Keyword-Häufigkeit: automatisierte Auszählung des sichtbaren `<body>`-Texts (HTML-Tags entfernt, HTML-Entities aufgelöst) je Seite.
- Wettbewerbs-Stichprobe: `curl -sk -L https://www.weber-haushaltgeraete.ch/` und `https://www.bichler.ch/`, Title/Description/JSON-LD-Vorkommen ausgezählt.
