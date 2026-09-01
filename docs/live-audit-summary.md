# Live-Audit vzugshop.ch – Konsolidierte Analyse

**Datum:** 2026-09-01
**Grundlage:** `docs/live-audit-design.md`, `-content.md`, `-seo.md`, `-qa.md`, `-security.md`, `-deployment.md` (sechs unabhängige Subagenten-Audits der Produktionsseite).
**Reviewer:** critical-reviewer (kritische Konsolidierung, keine eigene neue Live-Prüfung).

---

## 0. Vorab geklärt: DNS-Apex-Domain – kein Hosting-Fehler, keine Aktion nötig

Vier der sechs Berichte (design, content, qa, teilweise deployment) stufen die Nicht-Erreichbarkeit von `vzugshop.ch` (ohne `www`, Fremdzertifikat `CN=mibraflex.de`) als kritischen, sofort zu behebenden Plesk-/Hosting-Fehler ein. Der Auftraggeber hat das seither selbst verifiziert: Ein Request mit explizit gesetztem SNI-Hostname `vzugshop.ch` direkt gegen die per autoritativem Nameserver (`ns3.hosttech.ch`) **und** drei öffentlichen Resolvern (1.1.1.1, 8.8.8.8, 9.9.9.9) bestätigte IP `80.74.142.125` liefert HTTP 200 mit korrektem Inhalt. **Der Server ist für die Apex-Domain korrekt konfiguriert.** Was die vier Berichte sahen, war ein veralteter, lokal gecachter DNS-Eintrag (`185.101.158.113`, altes Hosttech-Parkzertifikat) in ihrer jeweiligen Sandbox/ihrem Netzwerk – exakt das, was die SEO-, Security- und Deployment-Berichte selbst schon als wahrscheinlichste Erklärung identifiziert und dokumentiert haben.

**Konsequenz für diese Analyse:** Der DNS-Punkt wird ab hier nicht mehr als offenes Problem geführt. Einzige verbleibende Handlungsempfehlung dazu: 24–48h abwarten, dann `dig vzugshop.ch` gegen mehrere öffentliche Resolver sowie `curl -I https://vzugshop.ch/` erneut gegenprüfen, bevor ein `www`→Apex-Redirect scharf geschaltet wird (siehe Abschnitt 3.2 – reine Vorsichtsmassnahme gegen nachhinkende Resolver-Caches, kein Hinweis auf ein reales Serverproblem).

Alle Folgeempfehlungen der vier Berichte, die *auf der falschen Prämisse "Apex ist tot" aufbauen* (SSL-Zertifikat neu ausstellen, Nameserver-Ticket bei Hosttech, Marketing bis auf Weiteres nur `www.` verwenden), sind damit **hinfällig**.

---

## 1. Neu bestätigter, echter Produktionsfehler: Security-Header erreichen keinen echten Seitenaufruf

Unabhängig vom DNS-Thema hat der Auftraggeber einen zweiten, ernsteren Befund selbst verifiziert, den nur die Security- und (in Teilen) die QA- und SEO-Berichte aufgegriffen haben:

- `curl -I` (HEAD) auf `https://www.vzugshop.ch/` liefert alle Security-Header aus `public/.htaccess` (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) korrekt.
- `curl -s -D - -o /dev/null https://www.vzugshop.ch/` (GET, mehrfach, mit Cache-Busting) – also das, was **jeder echte Browseraufruf** macht – liefert **keinen einzigen** dieser Header. Konsistent reproduzierbar, kein Cache-Artefakt.
- Unterschiedliches ETag-Format zwischen HEAD (`"755d-65a6d6446e693"`, klassisches Apache-Format) und GET (`"6a96ec1c-755d"`, anderes Format) bestätigt die technische Ursache: Plesk/nginx liefert echte GET-Aufrufe auf statische HTML-Dateien direkt aus (Sendfile/"Smart Static Files Processing") und umgeht dabei komplett das Apache-Backend, in dem `.htaccess`/`mod_headers` greift. HEAD-Requests und 301-Redirects laufen dagegen über das Backend und zeigen die Header korrekt.

**Das ist der eigentlich kritische, aktuelle Befund dieses Audits:** Kein echter Website-Besucher bekommt derzeit CSP, HSTS, Clickjacking- oder MIME-Sniffing-Schutz. Der Security-Bericht (Punkt 1) hat das unabhängig exakt so identifiziert; QA (Punkt 3) und SEO (Nebenbefund) kamen unabhängig auf dieselbe Beobachtung (fehlende Header bei GET), ohne die HEAD/GET-Diskrepanz und die ETag-Differenz explizit zu benennen – das macht den Security-Bericht hier am präzisesten. Alle drei sind sich in der Diagnose einig, nur die Tiefe der Erklärung unterscheidet sich. **Kein Widerspruch, sondern deckungsgleiche unabhängige Bestätigung.**

---

## 2. Konsolidierte Prioritätenliste (dedupliziert, DNS ausgeklammert)

| # | Finding | Gemeldet von | Kategorie | Priorität |
|---|---|---|---|---|
| 1 | Security-Header (CSP/HSTS/X-Frame-Options/etc.) erreichen keinen echten GET-Seitenaufruf – `.htaccess`/Apache-Backend wird für statische Dateien umgangen | Security (detailliert), QA, SEO (Nebenbefund) | Hosting/Plesk | **Kritisch** |
| 2 | Keine `Cache-Control`/`Expires`-Header auf gehashten `/_astro/`-Assets oder HTML | Deployment | Hosting/Plesk (da `.htaccess` nachweislich für GET wirkungslos ist, s. #1) | Hoch |
| 3 | `www.vzugshop.ch` liefert 200 ohne 301 auf die kanonische Apex-Domain – Duplicate-Content-Risiko | SEO, Deployment, (QA erwähnt Umkehrung) | Hosting/Plesk | Hoch (Timing: nach DNS-Propagations-Check, s. Abschnitt 0) |
| 4 | `public/sitemap.xml` listet URLs ohne Trailing Slash → 301-Hop zur kanonischen URL bei jedem Crawl | SEO, QA, Design (analog: interne Links) | **Code** | Hoch, trivial |
| 5 | Fehlende Open-Graph-/Twitter-Card-Tags in `Layout.astro` | SEO | **Code** (+ 1 Bild-Asset) | Mittel–Hoch (wegen WhatsApp-Sharing-Fokus der Zielgruppe) |
| 6 | Hero-Bild (`hero-standort.jpg`, 1600w-Variante ≈1.49 MB) ohne explizites `quality`-Prop, `fetchpriority="high"` | Design | **Code** | Mittel (Performance/LCP) |
| 7 | Interne Links ohne Trailing Slash (`Header.astro`, `Footer.astro`, CTAs) → unnötiger 301-Hop pro Klick | Design, QA | **Code** | Niedrig (Politur) |
| 8 | Web3Forms-Redirect-Feld `/danke` statt `/danke/` → ein 301-Hop nach Formularabsenden | QA | **Code** | Niedrig (Politur, gleicher Root-Cause wie #4/#7) |
| 9 | HSTS-Header ohne `preload`-Flag | Security | Hosting/Plesk, aber **erst nach Fix von #1** sinnvoll | Niedrig/optional |
| 10 | Web3Forms `access_key` – Domain-Restriktion im Dashboard prüfen | Security | Externe Konfiguration (Web3Forms-Dashboard, weder Code noch Plesk) | Niedrig |
| 11 | JSON-LD `@type: LocalBusiness` → optional `ElectronicsStore`, `priceRange` | SEO | **Code** | Sehr niedrig, optional |
| 12 | `sitemap-index.xml` liefert 404 | QA | Kein Fehler – Astro liefert bewusst nur `sitemap.xml`. Nur relevant, falls extern (z. B. Search Console) darauf verwiesen wurde. | Kein Handlungsbedarf |
| 13 | TLS-Legacy-Protokoll-Check (TLS 1.0/1.1) lokal nicht durchführbar | Security | Verifikation (SSL Labs), keine Änderung nötig | Info |

---

## 3. Code-Fixes (im Repo umsetzbar)

### 3.1 `public/sitemap.xml` – Trailing Slashes ergänzen (Finding #4)

Aktuell fehlt der Trailing Slash bei vier von fünf URLs, während `<link rel="canonical">` ihn auf jeder Unterseite führt. Fix (Datei manuell pflegen, da im Projekt keine automatische Sitemap-Generierung läuft):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>https://vzugshop.ch/</loc>
		<lastmod>2026-09-01</lastmod>
		<changefreq>monthly</changefreq>
		<priority>1.0</priority>
	</url>
	<url>
		<loc>https://vzugshop.ch/ueber-uns/</loc>
		<lastmod>2026-09-01</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.8</priority>
	</url>
	<url>
		<loc>https://vzugshop.ch/geraeteanfrage/</loc>
		<lastmod>2026-09-01</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.8</priority>
	</url>
	<url>
		<loc>https://vzugshop.ch/impressum/</loc>
		<lastmod>2026-09-01</lastmod>
		<changefreq>yearly</changefreq>
		<priority>0.3</priority>
	</url>
	<url>
		<loc>https://vzugshop.ch/datenschutz/</loc>
		<lastmod>2026-09-01</lastmod>
		<changefreq>yearly</changefreq>
		<priority>0.3</priority>
	</url>
</urlset>
```

Im selben Aufwasch (Finding #7, #8 – gleicher Root-Cause "Trailing-Slash-Konvention nicht konsequent"):
- `Header.astro`, `Footer.astro`, alle CTA-`href`-Werte in `index.astro`/`ueber-uns.astro` auf Trailing Slash umstellen (`/ueber-uns/`, `/geraeteanfrage/` statt `/ueber-uns`, `/geraeteanfrage`).
- `src/pages/geraeteanfrage.astro` Zeile 29: `new URL('/danke', Astro.site)` → `new URL('/danke/', Astro.site)`.

Diese drei Punkte sind kosmetisch (ein Redirect-Hop weniger pro Klick/Formularabsenden), aber trivial und ohne Risiko – im selben PR erledigen.

### 3.2 Open-Graph-/Twitter-Card-Tags (Finding #5)

Nur der SEO-Bericht hat dies gefunden, aber die Begründung ist stichhaltig und projektspezifisch: Die Seite bewirbt WhatsApp-Kontakt prominent (`WhatsAppButton.astro` auf jeder Seite) und die Zielgruppe teilt Links realistisch per WhatsApp/Instagram – ohne OG-Tags zeigt jede geteilte URL eine leere Linkvorschau. Das im SEO-Bericht vorgeschlagene `Layout.astro`-Snippet (Props `description`, `ogImage`, OG-/Twitter-Meta-Tags) ist umsetzbar und low-risk. Einzige Ergänzung nötig: `public/og-default.jpg`, 1200×630px, < 300 KB – das ist ein Bild-Asset, kein reiner Text-Fix; realistisch braucht das kurz Design-/Bildbearbeitungsaufwand (z. B. `hero-standort.jpg` als Basis mit Logo-Overlay).

Bewertung: sinnvoll, aber kein "kritisch" – ohne diese Tags verliert man nur an Social-Share-CTR, nichts bricht. Priorität "sollte in den nächsten Wochen kommen", nicht "sofort".

### 3.3 Hero-Bild-Qualität (Finding #6)

`hero-standort.jpg` in `index.astro` hat kein explizites `quality`-Prop; die generierte 1600w-Variante springt auf ~1.49 MB (vs. 161 KB bei 1024w) und wird mit `fetchpriority="high"`/`loading="eager"` sofort geladen – das kostet LCP unnötig auf breiten/Retina-Viewports. Fix: `quality={75}` (oder 80, konsistent mit den Showroom-Bildern) explizit setzen und die 1600w-Ausgabe neu prüfen. Nur vom Design-Bericht gefunden, aber plausibel und leicht verifizierbar (Bildgrössen-Sprung ist eindeutig überproportional zur Auflösungssteigerung).

### 3.4 Optional, niedrige Priorität

- JSON-LD `@type` `LocalBusiness` → `ElectronicsStore` (Subtyp), optional `priceRange`. Kein Fehler, nur potenziell treffendere Kategorisierung. Nicht dringend.
- `lastmod` in der Sitemap pro Seite statt einheitlich auf Build-Datum – nur relevant, falls Seiten sich künftig unterschiedlich oft ändern. Nicht dringend.

---

## 4. Hosting-/Plesk-Fixes (nicht im Repo lösbar)

Wichtiger Kontext für alle folgenden Punkte: **`.htaccess`-Änderungen allein lösen nichts mehr**, weil Finding #1 belegt, dass echte GET-Aufrufe auf statische Dateien das Apache-Backend (wo `.htaccess` überhaupt ausgewertet wird) komplett umgehen. Deployments Empfehlung, Cache-Control per `<FilesMatch>` in `.htaccess` zu ergänzen, würde also vermutlich am selben Bypass scheitern wie die Security-Header – das ist eine **Selbstwiderlegung im eigenen Bericht**, die dort nicht erkannt wurde (Deployment-Bericht Abschnitt 3 schlägt `.htaccess` vor, ohne den eigenen Befund aus dem gleichen Report zu Header-Konsistenz gegen Security-Bericht Punkt 1 zu prüfen). Alle Header- und Cache-Fixes gehören daher auf **nginx-Ebene**, nicht in `.htaccess`.

Alle folgenden Snippets sind für Plesk unter **Domain → Apache & nginx-Einstellungen → "Zusätzliche nginx-Direktiven"** gedacht (Feld pro Domain; bei `www.vzugshop.ch` als eigenständige Hosting-Einheit ggf. zusätzlich dort einfügen).

**Wichtiger nginx-Hinweis vorab:** Wenn eine `location`-Direktive eigene `add_header`-Anweisungen enthält, werden `add_header`-Anweisungen aus dem übergeordneten Kontext **nicht vererbt** (nginx-Eigenheit) – deshalb müssen alle Security-Header in jedem Block wiederholt werden, der eigene `add_header`-Zeilen braucht (z. B. der Cache-Control-Block für `/_astro/`).

### 4.1 Security-Header auf nginx-Ebene erzwingen (Finding #1 – kritisch)

```nginx
# Security-Header serverseitig erzwingen, unabhängig davon, ob die Anfrage
# über das Apache-Backend läuft oder von nginx direkt als statische Datei
# ausgeliefert wird (siehe live-audit-security.md, Befund 1).
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; form-action 'self' https://api.web3forms.com; frame-src https://www.google.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'" always;
```

Nach dem Einfügen zwingend mit echten GET-Requests (nicht nur `-I`) auf mehreren Seiten neu verifizieren:
```
curl -s -D - -o /dev/null "https://www.vzugshop.ch/?cachebust=$(date +%s)"
```

Falls die Header danach immer noch nicht bei GET ankommen: Im Plesk-Panel unter Hosting-Einstellungen prüfen, ob "Statische Dateien direkt von nginx verarbeiten lassen" ("Smart Static Files Processing") aktiv ist, und testweise deaktivieren – dann läuft auch GET wieder über das Apache-Backend (mit spürbarem, aber wahrscheinlich vertretbarem Performance-Overhead für eine kleine statische Seite).

### 4.2 Cache-Control für gehashte Build-Assets (Finding #2)

```nginx
# /_astro/-Dateien sind content-gehasht (z.B. Layout.pC20WPNu.css) und damit
# unveränderlich -> aggressiv cachen. HTML dagegen nie langfristig cachen,
# damit neue Deploys sofort sichtbar sind.
location ~* ^/_astro/ {
    add_header Cache-Control "public, max-age=31536000, immutable" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; form-action 'self' https://api.web3forms.com; frame-src https://www.google.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'" always;
}

location ~* \.html?$ {
    add_header Cache-Control "no-cache" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; form-action 'self' https://api.web3forms.com; frame-src https://www.google.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none'" always;
}
```

(4.1 + 4.2 lassen sich in einem einzigen Einfügevorgang kombinieren – 4.1 als Basis-Header, die beiden `location`-Blöcke aus 4.2 darunter.)

### 4.3 `www` → Apex 301-Redirect (Finding #3)

**Erst nach dem 24–48h-DNS-Propagationscheck aus Abschnitt 0 aktivieren** – wer aktuell noch die alte IP für die Apex-Domain aus dem Cache bekommt, würde sonst von der (für ihn funktionierenden) `www`-Seite aktiv auf eine für ihn kaputte Domain umgeleitet. Sobald `dig vzugshop.ch` überall `80.74.142.125` liefert:

Bevorzugt: In Plesk unter Hosting-Einstellungen der Domain nach einer "Preferred Domain" / "SEO-safe 301 redirect"-Option suchen (Standard-Feature für genau diesen Fall, kein Custom-Code nötig).

Falls nicht vorhanden, in die "Zusätzliche nginx-Direktiven" der `www.vzugshop.ch`-Hosting-Einheit:

```nginx
if ($host = www.vzugshop.ch) {
    return 301 https://vzugshop.ch$request_uri;
}
```

(Diese `if`-Form – ein reiner Host-Vergleich mit `return` – ist einer der von der nginx-Dokumentation selbst als unproblematisch eingestuften Ausnahmefälle der sonst berüchtigten "if is evil"-Warnung.)

### 4.4 HSTS `preload` (Finding #9 – niedrige Priorität)

Erst nachdem 4.1 verifiziert per GET funktioniert, optional `preload` ergänzen:
```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```
**Vorsicht:** Eintrag in die HSTS-Preload-Liste (hstspreload.org) ist praktisch nicht rückgängig zu machen und betrifft auch alle künftigen Subdomains. Nur nach bewusster Entscheidung des Kunden einreichen, nicht automatisch.

### 4.5 Nicht Plesk, nicht Code: Web3Forms-Dashboard (Finding #10)

Domain-Restriktion für den `access_key` (`b82697eb-...`) im Web3Forms-Dashboard auf `vzugshop.ch`/`www.vzugshop.ch` einschränken, damit der öffentlich sichtbare Key nicht von Drittseiten für Spam missbraucht werden kann. Weder Repo- noch Plesk-Änderung – reine Dashboard-Konfiguration beim Formularanbieter.

---

## 5. Kritische Würdigung der sechs Berichte

**Wo sich die Berichte tatsächlich einig sind (unabhängig bestätigt, hohe Konfidenz):**
- Fehlende Security-Header bei echten Seitenaufrufen (security, qa, seo).
- Sitemap-/Link-Trailing-Slash-Inkonsistenz (seo, qa, design).
- `www` liefert 200 ohne Redirect auf die kanonische Domain (seo, deployment).
- Inhaltlich ist die Seite sauber – keine Tippfehler, keine Platzhalter, korrekte Formularlogik (content, qa unabhängig bestätigt).

**Wo ein Bericht falschlag und wieso:** Design-, Content- und QA-Bericht deklarieren die Apex-Domain fälschlich als "komplett tot"/"site-weit blockierend" und leiten daraus eine **falsche Sofortmassnahme** ab (neues SSL-Zertifikat ausstellen, DNS-A-Record ändern) – beides wäre unnötige, potenziell schädliche Eingriffe in eine bereits korrekt konfigurierte Infrastruktur gewesen, hätte der Auftraggeber sie ungeprüft umgesetzt. Der SEO- und der Deployment-Bericht haben dagegen von sich aus mit `--resolve`/autoritativen Nameservern gegengeprüft und kamen zur richtigen Diagnose (lokaler DNS-Cache). **Lektion:** Bei einem einzelnen widersprüchlichen Netzwerkbefund (TLS-Handshake-Fehler) ist die Prüfung gegen einen zweiten, unabhängigen Auflösungspfad (autoritativer NS oder `--resolve` mit bekannter IP) Pflicht, bevor eine "kritisch, sofort handeln"-Einstufung vergeben wird – drei von sechs Berichten haben diesen Schritt übersprungen.

**Unpraktikable/übertriebene Einzelempfehlungen:**
- Der SEO-Bericht schlägt als "Defense-in-Depth" vor, den `www`→Apex-Redirect *zusätzlich* in `public/.htaccess` zu ergänzen. Das ist angesichts von Finding #1 (`.htaccess` wird bei GET nachweislich umgangen) **wirkungslose Doppelarbeit** – der Redirect gehört ausschliesslich auf nginx-Ebene (Abschnitt 4.3). Nicht falsch als Idee, aber in diesem konkreten Setup nutzlos.
- Der Deployment-Bericht schlägt vor, Cache-Control per `.htaccess`-`<FilesMatch>`-Block zu lösen (Abschnitt 3, oben referenziert) – aus demselben Grund vermutlich wirkungslos; korrekt wäre auch hier nginx (Abschnitt 4.2).
- Security-Bericht Punkt 6 (TLS-1.0/1.1-Legacy-Check "lokal nicht möglich, SSL-Labs empfohlen") ist eine sinnvolle, aber nicht dringende Nice-to-have-Verifikation – kein Hinweis auf ein tatsächliches Problem, nur eine Wissenslücke im Testsetup.
- QA-Bericht Punkt 5 (`sitemap-index.xml` 404) ist kein Fehler, sondern eine falsche Erwartungshaltung, was Astro standardmässig generiert – kein Handlungsbedarf, sollte nicht in eine Prioritätenliste neben echten Bugs stehen.

---

## 6. Empfohlene Reihenfolge

1. ~~**Sofort, Plesk:** Security-Header via nginx erzwingen (4.1)~~ **ERLEDIGT (2026-09-01):** "Intelligente Bearbeitung statischer Dateien" in Plesk deaktiviert (Apache bekommt jetzt alle Anfragen) und Header unter "Apache-Einstellungen → Zusätzliche Header" gesetzt (Format `Name: Wert`, nicht `Header always set ...` – Plesk lehnte die volle Apache-Direktiv-Syntax als ungültig ab). Per echtem GET-Request verifiziert: Header kommen an. `public/.htaccess` wurde daraufhin von den (nun doppelt ausgelieferten) Header-Direktiven bereinigt – einzige verbleibende Quelle ist Plesk selbst.
2. **Sofort, Code:** `public/sitemap.xml` Trailing Slashes (3.1) – triviale PR, kein Risiko.
3. **Diese Woche, Plesk:** Cache-Control für `/_astro/` (4.2) – spürbarer Performance-Gewinn für wiederkehrende Besucher, kann mit Punkt 1 zusammen eingefügt werden.
4. **Nach DNS-Propagationscheck (24–48h), Plesk:** `www` → Apex 301 (4.3).
5. **Diese/nächste Woche, Code + kleines Asset:** OG-/Twitter-Tags + `og-default.jpg` (3.2).
