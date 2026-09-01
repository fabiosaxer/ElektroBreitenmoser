# Live-Audit Security – vzugshop.ch

**Datum:** 2026-09-01
**Scope:** Rein passive Prüfung der öffentlich sichtbaren Konfiguration von `https://vzugshop.ch` und `https://www.vzugshop.ch` (kein Penetration-Testing). Ergänzt den Vor-Launch-Review in `docs/security-report.md`.

**Bereits als korrekt bestätigt (übernommen, nicht erneut geprüft):** Vollständige CSP aus `public/.htaccess`, `x-content-type-options: nosniff`, `x-frame-options: DENY`, `referrer-policy`, `permissions-policy`, `strict-transport-security: max-age=31536000; includeSubDomains` erscheinen bei `curl -I` (HEAD); HTTP→HTTPS-301-Redirect auf Port 80; gültiges Let's-Encrypt-Zertifikat für vzugshop.ch (SAN: vzugshop.ch, www.vzugshop.ch; ausgestellt 1. Sept 2026, gültig bis 30. Nov 2026, Issuer Let's Encrypt "YR1").

---

## Kritisch

### 1. Security-Header werden bei normalen GET-Requests auf HTML-Seiten NICHT ausgeliefert – nur bei HEAD
**Risiko:** Ein `curl -I` (HEAD-Request) liefert korrekt alle Header (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy). Ein normaler `curl` (GET) – also das, was jeder echte Browser-Seitenaufruf macht – liefert auf **allen** getesteten HTML-Seiten (`/`, `/geraeteanfrage/`, `/datenschutz/`, `/impressum/`, `/ueber-uns/`, auch explizit `/index.html`) **gar keine** dieser Header. Reproduziert mit drei unabhängigen Clients (curl, Python `urllib`, wiederholt über mehrere Requests und mit Cache-Busting-Query-Parameter) – kein Caching-Artefakt, konsistent reproduzierbar. Auch der interne `x-accel-version`-Header fehlt bei diesen Antworten, während er bei HEAD-Requests, 301-Redirects und bei GET auf `/favicon.ico`/`/robots.txt` vorhanden ist. Das deutet stark darauf hin, dass die Plesk/nginx-Reverse-Proxy-Schicht GET-Requests auf HTML-Dateien direkt statisch ausliefert (Sendfile o.ä.) und dabei am Apache-Backend – wo `mod_headers`/`.htaccess` greift – vorbeigeht, während HEAD-Requests (und Redirects) über das Backend laufen.

**Praktische Auswirkung:** Für jeden echten Website-Besucher sind aktuell CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy und Permissions-Policy auf den eigentlichen Seiteninhalten wirkungslos. Die in `public/.htaccess` sorgfältig konfigurierte Verteidigungslinie (siehe `docs/security-report.md`, Punkt 1) ist im produktiven Betrieb faktisch **nicht aktiv** – Clickjacking-Schutz, MIME-Sniffing-Schutz und CSP-Absicherung gegen XSS greifen im Ernstfall nicht. HSTS greift ebenfalls nicht auf dem ersten echten Seitenaufruf (nur bei HEAD sichtbar), was den erwarteten "einmal HTTPS erzwungen, dann immer"-Schutz für Browser, die die Seite reell laden, untergräbt.

**Fundort:** Live-Server-Konfiguration (Plesk/nginx-Reverse-Proxy vor Apache-Backend), nicht im Repo. Reproduktion:
```
curl -sS -D - -o /dev/null https://www.vzugshop.ch/          # KEINE Security-Header
curl -sS -I     https://www.vzugshop.ch/                     # Security-Header vorhanden
```

**Korrekturvorschlag:** Mit dem Hoster/im Plesk-Panel prüfen, ob "Nginx-Einstellungen: Statische Dateien direkt von nginx verarbeiten lassen" (Smart Static Files Processing) bzw. eine `limit_except`/method-basierte Weiche im generierten nginx-vHost aktiv ist, die GET vom Apache-Backend ausschliesst. Alternativ die Header **zusätzlich auf nginx-Ebene** setzen (Plesk erlaubt "Zusätzliche nginx-Direktiven" im Domain-Panel), sodass sie unabhängig vom Serving-Pfad (Apache-Backend vs. direktes nginx-Static-Serving) immer gesetzt werden – das ist robuster als sich allein auf `.htaccess`/Apache zu verlassen. Nach der Korrektur zwingend mit `curl` (GET, nicht nur `-I`) auf mehreren Seiten erneut verifizieren.

---

## Wichtig

### 2. DNS für die Nackt-Domain (`vzugshop.ch` ohne www) zeigt bei manchen Resolvern auf einen fremden, veralteten Host
**Risiko:** Über den lokalen Test-Resolver löste `vzugshop.ch` (Apex, ohne `www`) auf `185.101.158.113` auf – ein Server, der ein am 2. April 2021 abgelaufenes Let's-Encrypt-Zertifikat für eine völlig fremde Domain (`mibraflex.de`) ausliefert und keine HTTP-Antwort liefert ("Empty reply"). Über öffentliche Resolver (Google 8.8.8.8, Cloudflare 1.1.1.1) sowie bei direkter Anfrage an die korrekte IP `80.74.142.125` liefert `vzugshop.ch` hingegen korrekt die Seite mit gültigem Zertifikat aus. **Einschätzung:** Sehr wahrscheinlich ein veralteter DNS-Cache-Eintrag beim lokal genutzten Resolver in dieser Testumgebung (der Fremd-Host/das Fremdzertifikat ist über 5 Jahre alt) und kein aktuelles Problem der Live-DNS-Zone – die massgeblichen öffentlichen Resolver sind bereits korrekt. Dennoch: sollte diese alte IP/dieser A-Record irgendwo (z. B. bei einem sekundären DNS-Provider, einer CDN-Konfiguration oder als Backup-Eintrag) tatsächlich noch aktiv hinterlegt sein, würde ein Teil der Besucher die Seite gar nicht bzw. mit Zertifikatsfehler für eine fremde Domain sehen.

**Fundort:** DNS-Zone für `vzugshop.ch` (extern, nicht im Repo).

**Korrekturvorschlag:** Beim DNS-/Domain-Provider den A-Record (und ggf. AAAA) für die Apex-Domain `vzugshop.ch` gegenprüfen und sicherstellen, dass ausschliesslich `80.74.142.125` (gleiche IP wie `www`) hinterlegt ist, keine veralteten Sekundärhinterlegungen. Mit `dig vzugshop.ch @<jeweiliger-NS-des-Providers>` direkt bei den autoritativen Nameservern verifizieren.

### 3. Kein `preload`-Flag im HSTS-Header
**Risiko:** `Strict-Transport-Security: max-age=31536000; includeSubDomains` erfüllt formal bereits die Mindestanforderungen für die HSTS-Preload-Liste (max-age ≥ 1 Jahr, `includeSubDomains`), es fehlt aber das `preload`-Flag selbst. Ohne Preload-Listeneintrag ist der allererste Aufruf einer neuen Browser-Installation theoretisch noch per Klartext-HTTP angreifbar (SSL-Stripping), bevor der HSTS-Header das erste Mal gesehen wurde.

**Fundort:** `public/.htaccess`, `Header always set Strict-Transport-Security`.

**Korrekturvorschlag:** Kein akuter Handlungsbedarf, da Punkt 1 (Header greifen nicht auf GET) vorrangig zu beheben ist. Danach optional: `preload` ergänzen und Domain unter hstspreload.org einreichen – das ist aber ein Commitment (kaum rückgängig zu machen, betrifft auch alle künftigen Subdomains), daher nur nach bewusster Entscheidung.

---

## Empfehlung

### 4. Web3Forms-Konfiguration – geprüft, unauffällig
`src/pages/geraeteanfrage.astro`: Honeypot-Feld (`name="botcheck"`) ist vorhanden (löst den früheren Befund #2 aus `docs/security-report.md`), Formular postet an `https://api.web3forms.com/submit`, passend zur `form-action`-Direktive in der CSP. Der eingebettete `access_key` ist bei Web3Forms als öffentlicher, client-seitig sichtbarer Schlüssel vorgesehen (kein Secret) – Empfehlung: im Web3Forms-Dashboard die Domain-Restriktion auf `vzugshop.ch`/`www.vzugshop.ch` aktivieren/prüfen, damit der Key nicht von fremden Seiten zum Spam-Versand missbraucht werden kann.

### 5. Kein Server-Versions-Banner sichtbar
`Server: nginx` ohne Versionsnummer, kein `X-Powered-By`, kein PHP-Banner. Getestete typische sensible Pfade (`/.env`, `/.git/config`, `/wp-login.php`, `/phpinfo.php`, `/server-status`, `/server-info`, `/package.json`, `/astro.config.mjs`) liefern durchweg 404; `/.htaccess` liefert 403 (nicht 200 mit Inhalt) – korrekt. Keine Massnahme nötig.

### 6. TLS-Protokoll/Cipher – grob geprüft, modern
Server unterstützt TLS 1.3 (`TLS_AES_256_GCM_SHA384`) und TLS 1.2 mit `ECDHE-RSA-AES256-GCM-SHA384` (PFS, starke Cipher). Test auf TLS 1.0/1.1 war mit der lokalen OpenSSL-Version nicht durchführbar (Client verweigert bereits den Verbindungsaufbau mit alten Protokollen) – **keine abschliessende Aussage möglich, ob der Server sie noch anbietet**. Empfehlung: einmalig extern über SSL Labs (ssllabs.com/ssltest) oder `testssl.sh` von einem Host mit vollständiger Legacy-Protokoll-Unterstützung gegenprüfen, um ein belastbares Gesamt-Grading zu erhalten.

### 7. `www` vs. Apex-Domain – kein zusätzliches Sicherheitsrisiko, nur SEO-Thema bestätigt
Zertifikat deckt beide Varianten korrekt per SAN ab (`vzugshop.ch`, `www.vzugshop.ch`), CSP/HSTS/übrige Header sind (im Rahmen von Punkt 1) auf beiden Varianten identisch konfiguriert – kein sicherheitsrelevanter Unterschied zwischen Apex und `www` über die eigentliche Duplicate-Content-Problematik hinaus.

---

## Zusammenfassung

| # | Befund | Einstufung |
|---|---|---|
| 1 | Security-Header fehlen bei echten GET-Seitenaufrufen (nur bei HEAD vorhanden) | **Kritisch** |
| 2 | Apex-DNS bei manchen Resolvern veraltet/falsch (vermutlich nur lokaler Cache) | Wichtig |
| 3 | HSTS ohne `preload`-Flag | Wichtig (optional) |
| 4 | Web3Forms: Honeypot vorhanden, Konfiguration unauffällig | Empfehlung (Doku) |
| 5 | Kein Server-/PHP-Versionsbanner, sensible Pfade liefern 404/403 | – (bestätigt) |
| 6 | TLS 1.2/1.3 mit starken Ciphers; Legacy-Protokoll-Test lokal nicht möglich | Empfehlung |
| 7 | www/Apex-Zertifikat und Header-Konfiguration konsistent | – (bestätigt) |
