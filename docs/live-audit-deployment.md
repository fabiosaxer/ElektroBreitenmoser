# Live-Deployment-Audit – vzugshop.ch

**Geprüft:** `gh run list`, `git log origin/main`/`origin/dist`, lokaler `npm run build` vs. Live-HTML, HTTP-Header (`curl -I`), DNS-Auflösung (System-Resolver, 8.8.8.8, 1.1.1.1, autoritative Nameserver `ns{1,2,3}.hosttech.ch`), TLS-Handshake (`openssl s_client`).

## 1. CI/CD-Pipeline und Deploy-Stand

- Die letzten 5 GitHub-Actions-Läufe (`Build and deploy static site`) sind **alle grün** (`completed success`), zuletzt für Commit `a59b834` ("Set the browser tab favicon…").
- `origin/dist` (HEAD `9af1c82`) enthält die Deploy-Message `deploy: a59b834097ea25cf4409bd136923b8b6f1e9148c` und entspricht damit exakt dem aktuellen `origin/main`-HEAD. **Kein veralteter Deploy-Stand.**
- Workflow nutzt `force_orphan: true` beim Push in `dist` — daher meldet `git fetch` einen "forced update"; das ist erwartetes Verhalten dieses Deploy-Musters, kein Fehler.
- **Ergebnis: Pipeline funktioniert wie vorgesehen, Plesk zieht den aktuellen Stand.**

## 2. Content-Konsistenz: lokaler Build vs. Live

`npm run build` lokal ausgeführt (6 Seiten, 0 Fehler/Warnungen) und mit Live-HTML von `https://vzugshop.ch/` (per `curl`, IP explizit auf den aktuellen Server `80.74.142.125` gepinnt, siehe Abschnitt 4) verglichen:

- `<title>`: identisch (`V-ZUG Fachhändler Marbach · Elektro Breitenmoser AG`).
- Hero-H1: identisch (`Ihr V-ZUG Fachhändler in Marbach`).
- Favicon-Links (`/favicon.ico`, `/favicon-32x32.png`, `/favicon-16x16.png`, `/apple-touch-icon.png`): identisch, inkl. `content-length`/`etag` der Assets.
- `content-length` von `index.html` (30045 Bytes) sowie Last-Modified der Live-Antwort passen zum lokalen Build-Zeitstempel.

**Ergebnis: Live-Seite entspricht 1:1 dem, was `npm run build` aus dem aktuellen `main` erzeugt.**

## 3. HTTP-Cache-Header

Geprüft: `index.html`, `robots.txt`, ein gehashtes CSS-Asset (`/_astro/Layout.pC20WPNu.css`), ein gehashtes Bild-Asset (`/_astro/hero-standort.*.webp`).

Alle Antworten enthalten **dieselben** Security-Header (aus `.htaccess`, via `mod_headers`/`mod_rewrite` – Apache hinter dem nginx-Reverse-Proxy von Plesk) sowie `last-modified`/`etag`, aber:

- **Kein `Cache-Control`- oder `Expires`-Header auf irgendeiner Ressource** — weder auf HTML noch auf den gehashten `_astro/`-Assets. Browser können nur per bedingtem GET (If-None-Match/If-Modified-Since) validieren, aber nicht ohne Netzwerk-Roundtrip aus dem lokalen Cache bedienen.
- Das ist eine verschenkte Optimierung: Dateien unter `/_astro/` tragen bereits Content-Hashes im Dateinamen (z. B. `Layout.pC20WPNu.css`) und sind damit unveränderlich — sie sollten `Cache-Control: public, max-age=31536000, immutable` bekommen. HTML-Seiten (`index.html` etc.) sollten dagegen kurz/nicht gecacht werden (`Cache-Control: no-cache` oder kurzes `max-age`), damit neue Deploys sofort sichtbar sind.
- **Empfehlung:** In `public/.htaccess` einen `<FilesMatch>`-Block für `_astro/` (bzw. per `<Directory>`/`Location` in Plesk, falls `AllowOverride` das nicht zulässt) ergänzen, analog zum bestehenden `mod_headers`-Block für die Security-Header. Separat prüfen, ob Plesk/nginx als Reverse-Proxy diese Header durchreicht (der `x-accel-version`-Header deutet auf eine nginx→Apache-Kette hin, in der `.htaccess`-Regeln vom Apache-Backend kommen, nginx aber ggf. eigene Regeln bräuchte für rein statische Auslieferung).

## 4. DNS/TLS-Auffälligkeit bei der Apex-Domain `vzugshop.ch` (kritisch, zeitkritisch)

Beim ersten Test schlug `curl -I https://vzugshop.ch/` mit **`SSL certificate problem` bzw. `certificate has expired`** fehl — sowohl über den lokalen Netzwerk-Resolver als auch über das WebFetch-Tool (unabhängiger Netzwerkpfad). Root-Cause-Analyse:

- Autoritative Nameserver der Zone (`ns1/ns2/ns3.hosttech.ch`) liefern **korrekt und übereinstimmend** `vzugshop.ch → 80.74.142.125` (identisch mit `www.vzugshop.ch`) — die DNS-Zonenkonfiguration selbst ist korrekt.
- Öffentliche Resolver (8.8.8.8, 1.1.1.1) liefern ebenfalls korrekt `80.74.142.125`.
- Mein lokaler Netzwerk-Resolver **und** das WebFetch-Tool lieferten dagegen noch einen **veralteten, gecachten A-Record** (`185.101.158.113`, reverse DNS `default.hosttech.eu`) — ein Hosttech-Default-/Parkplatzserver, der ein **seit April 2021 abgelaufenes Zertifikat für eine fremde Domain (`mibraflex.de`)** ausliefert und auf HTTP/HTTPS-Requests mit "Empty reply" antwortet.
- **Interpretation:** Das ist kein Hosting-/Plesk-Konfigurationsfehler, sondern ein **DNS-Propagations-Nachlauf** nach der kürzlichen Umstellung des A-Records der nackten Domain auf den Hosttime-Server. Da unabhängig von mir auch das WebFetch-Tool (anderer Netzwerkpfad) denselben veralteten Eintrag sah, ist davon auszugehen, dass **aktuell noch ein relevanter Anteil realer Besucher** (abhängig vom DNS-Cache ihres ISPs) beim Aufruf von `https://vzugshop.ch/` (ohne `www`) einen Zertifikatsfehler oder eine leere Antwort bekommt statt der Website.
- Aktuelle TTL beim autoritativen Server: 10800 s (3 h) — alte, noch zirkulierende Caches können aber eine längere TTL von vor der Umstellung tragen; volle weltweite Propagation kann je nach vorheriger TTL bis zu 24–48 h dauern.

**Handlungsempfehlung:**
1. Kein Eingriff im Plesk-Hosting nötig — DNS-Zone ist korrekt konfiguriert.
2. Situation beobachten/erneut prüfen (z. B. `dig +short vzugshop.ch` gegen mehrere öffentliche Resolver, `curl -I https://vzugshop.ch/`) bis flächendeckend `80.74.142.125` ankommt und das Zertifikat für `vzugshop.ch` statt `mibraflex.de` zurückkommt.
3. **Bis zur vollständigen Propagation keinen harten `www` → non-`www`-Redirect scharf schalten** (siehe Punkt 5) — sonst werden Nutzer mit noch veraltetem DNS-Cache aktiv von der funktionierenden `www`-Domain auf die für sie gerade kaputte Apex-Domain umgeleitet, was die Situation verschlimmert statt verbessert.
4. Falls das Problem nach 48 h weiterhin auftritt, direkt bei Hosttech (Registrar/DNS-Provider) nachfragen, ob am Nameserver-Cluster selbst noch alte Records zirkulieren.

## 5. `www.vzugshop.ch` ohne Redirect auf kanonische Domain

Bestätigt: `https://www.vzugshop.ch/` liefert `HTTP/2 200` direkt (kein `301`/`302` auf `vzugshop.ch`). `public/.htaccess` enthält nur eine `HTTPS`-Erzwingung (`RewriteCond %{HTTPS} off`), aber **keine Regel, die `www` auf non-`www` (oder umgekehrt) umschreibt**.

Das ist primär ein SEO-Thema (Duplicate Content, siehe SEO-Audit), aber auch technisch ein Hosting-/Plesk-Thema:

- In Plesk muss die `www`-Subdomain als **Domain-Alias** der Hauptdomain `vzugshop.ch` eingerichtet sein (nicht als separates, eigenständiges Hosting), damit beide auf denselben Document Root zeigen — das ist hier offenbar der Fall (identischer Content, identische `content-length`/`etag`), spricht also für korrekte Alias-Verknüpfung im Plesk-Hosting-Setup.
- Es fehlt aber die **301-Redirect-Regel** zwischen den beiden Hostnamen. Empfehlung: in `public/.htaccess` einen `RewriteCond %{HTTP_HOST} ^www\.vzugshop\.ch$ [NC]` mit `RewriteRule ^ https://vzugshop.ch%{REQUEST_URI} [L,R=301]` ergänzen (vor der bestehenden HTTPS-Regel), **aber siehe Punkt 4 oben** — solange die DNS-Propagation der Apex-Domain nicht vollständig durch ist, diesen Redirect zurückstellen, da er sonst Nutzer auf eine für sie kaputte Domain zwingt.
- TLS-Zertifikat für `www.vzugshop.ch` ist gültig und korrekt (Let's Encrypt, Kette bis `ISRG Root X1`, Chain-Länge 3) — dieser Teil des Hostings ist sauber konfiguriert.

## Zusammenfassung Prioritäten

| # | Befund | Schweregrad | Aktion |
|---|---|---|---|
| 1 | CI/CD grün, dist == main | OK | keine |
| 2 | Live-Content == lokaler Build | OK | keine |
| 3 | Keine Cache-Control-Header auf statischen Assets | niedrig/mittel | `.htaccess` um Cache-Control-Regeln für `_astro/` ergänzen |
| 4 | DNS-Propagation Apex-Domain noch nicht global durch → teils abgelaufenes Fremd-Zertifikat sichtbar | **hoch, aber selbstheilend** | beobachten, in 24–48h erneut prüfen, keinen Redirect draufsetzen bis durch |
| 5 | `www` redirected nicht auf non-`www` | mittel (SEO + Hosting) | 301-Regel ergänzen, aber erst nach Punkt 4 |
