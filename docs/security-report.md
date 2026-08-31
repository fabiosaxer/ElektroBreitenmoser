# Security-Review – Elektro Breitenmoser AG Website

**Datum:** 2026-08-31
**Scope:** `src/`, `astro.config.mjs`, `package.json`, `.github/workflows/deploy.yml`, `public/`
**Kontext:** Rein statische Astro-Site, kein eigener Server/Backend, kein Login, kein DB-Zugriff. Deployment via GitHub Actions → Branch `dist` → Plesk/Hosttime (Git-Integration) dient die Dateien direkt aus dem Document Root (typischerweise Apache-basiert). Einziges Formular sendet clientseitig direkt an einen externen Formspree-Endpoint.

Da kein eigener Server existiert, entfallen serverseitige Themen wie Input-Validierung im eigenen Backend, DB-Injection, Session-/Cookie-Handling, Auth und klassisches CSRF (kein State auf dem eigenen Server, der durch einen gefälschten Request verändert werden könnte). Der Bericht fokussiert auf das, was in einem reinen Static-Hosting-Kontext tatsächlich relevant ist.

---

## Kritisch

Keine kritischen Befunde. Es gibt keine Angriffsfläche mit unmittelbarem Schadenspotenzial (kein Server, keine Secrets im Repo, keine bekannten Dependency-CVEs, kein reflektierter/gespeicherter User-Input im DOM).

---

## Wichtig

### 1. Keine HTTP-Security-Header gesetzt
**Risiko:** Es existiert weder eine `.htaccess` noch eine sonstige Header-Konfiguration in `public/` oder im Build-Output. Ohne CSP/HSTS/X-Content-Type-Options/X-Frame-Options fehlt eine wichtige Verteidigungslinie in der Tiefe (z. B. gegen Clickjacking, MIME-Sniffing, oder falls künftig doch einmal eine XSS-Lücke entsteht – etwa durch ein später ergänztes Drittanbieter-Skript).

**Fundort:** `public/` (kein `.htaccess`), `astro.config.mjs` (kein `headers`-/Middleware-Mechanismus, da `output: 'static'` per Default – Astro liefert bei rein statischem Export keine eigenen Response-Header aus).

**Korrekturvorschlag:** Da Plesk/Hosttime das `dist`-Verzeichnis typischerweise über Apache ausliefert, kann eine `.htaccess` direkt im Projekt unter `public/.htaccess` gepflegt werden (wird von Astro 1:1 nach `dist/` kopiert und landet damit im Document Root):

```apache
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"
  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains" env=HTTPS

  # CSP: Es werden aktuell keine externen Scripts eingebunden (nur Inline-Scripts
  # für Mobile-Menü und den Query-Param-Vorbeleger im Formular). Deshalb kann die
  # CSP eng gefasst werden. 'unsafe-inline' ist nötig, solange Astro die zwei
  # Inline-<script>-Blöcke ohne Hash/Nonce ausliefert (Alternative: Hashes der
  # gebauten Skripte ermitteln und statt 'unsafe-inline' eintragen).
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; form-action 'self' https://formspree.io; frame-ancestors 'none'; base-uri 'self'; object-src 'none'"
</IfModule>
```

Wichtig: `form-action` muss den tatsächlichen Formspree-Endpoint erlauben (aktuell Platzhalter `formspree.io/f/REPLACE_ME` in `src/pages/geraeteanfrage.astro:6` – Domain `formspree.io` bereits korrekt in der CSP berücksichtigt).

Vor dem produktiven Einsatz: Header nach Deployment via `curl -I https://<domain>` verifizieren, da Plesk-Konfigurationen `.htaccess` teils überschreiben/deaktivieren (`AllowOverride`-Einstellung prüfen) – ggf. mit dem Hoster/über das Plesk-Panel direkt statt/zusätzlich zur `.htaccess` setzen.

### 2. Kein Bot-/Spam-Schutz beim Kontaktformular
**Risiko:** `src/pages/geraeteanfrage.astro` sendet per reinem HTML-`POST` an Formspree, ohne jegliche Bot-Abwehr. Formulare ohne Schutzmassnahme werden erfahrungsgemäss schnell von Spam-Bots gefunden und geflutet (verbraucht das kostenlose Formspree-Kontingent, erzeugt Spam-Mails an den Kunden, kann bei Volumenlimit dazu führen, dass echte Anfragen nicht mehr ankommen).

**Fundort:** `src/pages/geraeteanfrage.astro:17-92` (Formular ohne Honeypot, ohne Captcha, ohne clientseitiges Zeit-/Rate-Limit).

**Korrekturvorschlag:** Formspree unterstützt einen einfachen Honeypot ohne zusätzlichen Server-Code – ein verstecktes Feld, das Formspree automatisch erkennt und Einsendungen damit verwirft:

```html
<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" />
```

(Feld per CSS visuell verstecken statt `type="hidden"`, damit Screenreader/Bots es nicht unterschiedlich behandeln als vorgesehen; `tabindex="-1"` und `autocomplete="off"` verhindern, dass Menschen es versehentlich ausfüllen.)

Ergänzend/alternativ, falls nach Launch weiterhin Spam auftritt: Formspree bietet auch eine native reCAPTCHA-Integration (Formular-Setting im Formspree-Dashboard, kein Codeänderung nötig) sowie serverseitiges Rate-Limiting auf Formspree-Seite selbst.

### 3. Platzhalter-Endpoint im Formular (funktional, sicherheitsrelevant im weiteren Sinn)
**Risiko:** `formEndpoint = 'https://formspree.io/f/REPLACE_ME'` ist kein echter Endpoint. Kein akutes Sicherheitsrisiko, aber: wird dies vor Launch übersehen, gehen Kundenanfragen ins Leere, ohne dass dies aus Nutzersicht sichtbar wäre (kein Server-Fehler, Formspree meldet schlicht 404, der Browser zeigt ggf. trotzdem eine Weiterleitung). Sicherheitsrelevanter Nebeneffekt: sobald der echte Endpoint eingetragen wird, sollte geprüft werden, dass er zum eigenen Formspree-Projekt gehört (nicht versehentlich eine fremde/veraltete Form-ID), damit keine Kundendaten an einen falschen/fremden Account gehen.

**Fundort:** `src/pages/geraeteanfrage.astro:6`.

**Korrekturvorschlag:** Vor Go-Live: echten Formspree-/Web3Forms-Endpoint eintragen, per Testeinsendung verifizieren, und `form-action` in der CSP (siehe Punkt 1) auf die tatsächlich genutzte Zieldomain abstimmen.

---

## Empfehlung

### 4. `set:html` – geprüft, aktuell unbedenklich, aber Konvention für die Zukunft festhalten
Zwei Stellen nutzen Astros `set:html` (Äquivalent zu `innerHTML`):

- `src/layouts/Layout.astro:54` – JSON-LD (`localBusinessJsonLd`), gerendert via `JSON.stringify(...)`. Alle enthaltenen Werte (Name, Adresse, Telefonnummer, taxID, `sameAs`) sind statische, vom Entwickler im Code hinterlegte Werte – keine Nutzereingabe, kein Build-Time-Fetch von unvertrauenswürdigen Quellen. **Kein XSS-Risiko.**
- `src/components/ApplianceIcon.astro:130` – SVG-Pfaddaten aus einer festen `ICONS`-Lookup-Tabelle im selben Datei. Der einzige Aufrufer (`src/pages/index.astro:176`) übergibt ausschliesslich `slug`-Werte aus der statischen, im Repo gepflegten `src/data/appliances.ts` – keine URL-Parameter oder Nutzereingaben erreichen diese Komponente. **Kein XSS-Risiko.**

**Empfehlung (defensiv, kein akuter Handlungsbedarf):** Sollte künftig einer dieser beiden `set:html`-Aufrufe um dynamische/externe Daten erweitert werden (z. B. CMS-Import, Nutzereingabe, Drittanbieter-Feed), muss vor der Ausgabe zwingend sanitisiert bzw. escaped werden. Als Leitplanke im Code: Kommentar an beiden Stellen ergänzen, der festhält, dass `set:html` hier nur mit statischen, entwicklerkontrollierten Daten verwendet werden darf.

### 5. Kein `try/catch` bzw. keine Bereinigung des URL-Parameters im Formular-Vorbeleger
**Fundort:** `src/pages/geraeteanfrage.astro:96-106`. Der Query-Parameter `geraet` aus `window.location.search` wird ungeprüft in einen CSS-Attribut-Selektor eingesetzt: `` `#device option[data-slug="${slug}"]` ``. Kein XSS (landet nicht im DOM als HTML), aber: enthält der Parameter ein `"`-Zeichen, wirft `querySelector` eine `SyntaxError`-Exception, die hier nicht abgefangen wird und das restliche Inline-Script crashen lassen könnte (rein clientseitiges Robustheits-/Verfügbarkeitsproblem, kein Sicherheitsrisiko im engeren Sinn).

**Korrekturvorschlag:** Wert vor Verwendung mit `CSS.escape(slug)` behandeln oder per `Array.from(options).find(o => o.dataset.slug === slug)` statt String-Interpolation in den Selektor suchen.

### 6. Kein SRI nötig – keine externen Scripts eingebunden
Geprüft: Es werden aktuell keine Drittanbieter-`<script src="...">`-Einbindungen oder CDN-Ressourcen geladen (nur zwei Inline-`<script>`-Blöcke, beide selbst geschrieben und ohne externe Abhängigkeit). Externe Links (Instagram, Google Maps, vzug.com) sind reine `<a>`-Links mit korrekt gesetztem `rel="noopener noreferrer"` bei `target="_blank"` (`src/components/Footer.astro:21-23,41-43`, `src/pages/index.astro:301-303`). **Keine Massnahme nötig.** Sollte künftig ein externes Skript (z. B. Analytics, Maps-Embed als `<script>`) ergänzt werden, dann SRI-Hash setzen, sofern die Ressource von einer statischen, versionierten URL geladen wird.

### 7. HTTPS-Erzwingung serverseitig sicherstellen
Astro/GitHub Actions können HTTPS nicht erzwingen – das liegt vollständig beim Hosting (Plesk/Hosttime). Es findet sich im Repo keine HTTP→HTTPS-Redirect-Regel.

**Korrekturvorschlag:** In derselben `public/.htaccess` (siehe Punkt 1) einen Redirect ergänzen, sofern Plesk dies nicht bereits automatisch per Let's-Encrypt-Integration übernimmt (in Plesk meist über "Permanent SEO-safe 301 redirect from HTTP to HTTPS"-Option im SSL/TLS-Panel steuerbar – dort prüfen, ob das bereits aktiv ist, bevor zusätzlich eine `.htaccess`-Regel ergänzt wird, um doppelte Redirects zu vermeiden):

```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### 8. Secrets/Abhängigkeiten – keine Befunde
- **Secrets im Code:** Keine API-Keys, Passwörter oder Tokens im Repo gefunden. `.gitignore` schliesst `.env`/`.env.production` korrekt aus. Der Formspree-Endpoint ist als reiner Formular-`action`-Pfad öffentlich sichtbar (das ist bei Formspree so vorgesehen und kein Secret – die Form-ID ist kein Auth-Token).
- **GitHub Actions:** `deploy.yml` nutzt ausschliesslich das automatisch bereitgestellte `secrets.GITHUB_TOKEN` mit Standard-Berechtigungen (`permissions: contents: write`), keine zusätzlichen persönlichen Zugangsdaten im Workflow.
- **`npm audit`:** 0 Schwachstellen (0 critical/high/moderate/low/info) bei 322 Paketen (Stand heute). Abhängigkeiten sind auf zwei aktuell gepflegte Kernpakete beschränkt (`astro ^7.2.9`, `tailwindcss` + `@tailwindcss/vite` `^4.3.3`) – keine unmaintained/veralteten Pakete erkennbar.

---

## Zusammenfassung der offenen Punkte

| # | Befund | Einstufung |
|---|---|---|
| 1 | Keine HTTP-Security-Header (CSP, HSTS, X-Frame-Options, …) | Wichtig |
| 2 | Kein Honeypot/Spam-Schutz im Kontaktformular | Wichtig |
| 3 | Formspree-Endpoint noch Platzhalter | Wichtig (vor Launch) |
| 4 | `set:html` an 2 Stellen – geprüft, unbedenklich (nur statische Daten) | Empfehlung (Doku) |
| 5 | Ungeschützte String-Interpolation in CSS-Selektor (Query-Param) | Empfehlung |
| 6 | Keine externen Scripts – SRI aktuell nicht nötig | Empfehlung (für später) |
| 7 | HTTPS-Redirect serverseitig verifizieren | Empfehlung |
| 8 | Keine Secrets im Code, `npm audit` clean | – (bestätigt) |
