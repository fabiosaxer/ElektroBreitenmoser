# Live-Audit: vzugshop.ch (Design/UX, Produktion)

Datum: 2026-09-01
Geprüft: https://vzugshop.ch/, https://www.vzugshop.ch/, /ueber-uns/, /geraeteanfrage/ (WebFetch + curl/openssl gegen den echten Produktionsserver, Hosttime/Plesk, Apache/nginx, IP 185.101.158.113)

## 0. KRITISCH – Apex-Domain vzugshop.ch (ohne www) ist in Produktion komplett tot

Das ist der mit Abstand wichtigste Befund und überlagert alle Design-/UX-Fragen, weil er einen Grossteil der Besucher gar nicht erst auf die Seite lässt.

- `https://vzugshop.ch/` (ohne `www.`) baut zwar eine TLS-Verbindung auf, liefert dabei aber ein **fremdes, seit April 2021 abgelaufenes Zertifikat für eine völlig andere Domain** (`CN=mibraflex.de`, Let's Encrypt). Browser zeigen sofort eine Sicherheitswarnung für die falsche Domain.
- Klickt man die Warnung weg, bricht die Verbindung ab (`Empty reply from server`) – es kommt **keine Antwort/Kein Inhalt**, auch mit `-k` (Zertifikatsprüfung ignoriert) nicht.
- `http://vzugshop.ch/` (Port 80, ohne www) liefert ebenfalls **keine Antwort** (`Empty reply from server`) – keine Weiterleitung auf https/www, kein Fallback.
- Im Gegensatz dazu funktioniert `https://www.vzugshop.ch/` einwandfrei: gültiges, frisches Let's-Encrypt-Zertifikat für `CN=vzugshop.ch` (ausgestellt 1.9.2026, gültig bis 30.11.2026), korrekter Seiteninhalt, `http://www.vzugshop.ch/` leitet sauber per 301 auf https+www weiter.

Warum das kritisch ist:
- `astro.config.mjs` legt die Apex-Domain (ohne www) explizit als "Hauptdomain (vom Kunden bestätigt)" fest. Dementsprechend zeigen **alle `<link rel="canonical">`-Tags, das JSON-LD `url`-Feld, `robots.txt` (`Sitemap: https://vzugshop.ch/sitemap.xml`) und `sitemap.xml` selbst auf die kaputte Apex-Domain** – während der Server, der tatsächlich antwortet, nur unter `www.` läuft.
- Jeder Nutzer, der `vzugshop.ch` ohne `www.` eintippt (Standardverhalten – z. B. Chrome versucht heute direkt https auf die eingegebene Eingabe), landet auf einer Zertifikatswarnung für eine fremde Domain und danach auf einer leeren Verbindung. Das betrifft potenziell Google-Ads-Klicks, Visitenkarten, mündliche Weitergabe der URL usw.
- Googlebot kann `sitemap.xml` über die in `robots.txt` angegebene Apex-URL nicht laden, weil genau diese Domain das kaputte Zertifikat liefert – das gefährdet die Indexierung.

Empfohlene Sofortmassnahme (Hosting/Plesk, kein Code-Fix): In Plesk für `vzugshop.ch` (Apex) ein gültiges SSL-Zertifikat ausstellen/zuordnen (z. B. per Let's-Encrypt-Erweiterung, SAN inkl. `vzugshop.ch` und `www.vzugshop.ch` in einem Zertifikat) und einen 301-Redirect Apex → `www.vzugshop.ch` (oder umgekehrt, je nach gewünschter kanonischer Richtung) einrichten, analog zur bereits funktionierenden `www`-Konfiguration. Bis das behoben ist, sollte in Marketing-Material ausschliesslich `https://www.vzugshop.ch` verwendet werden.

## 1. Alles Weitere bezieht sich auf www.vzugshop.ch (dort ist die Seite live und lädt korrekt)

### Laden von Assets – grösstenteils sauber
- Logo (`/logo.png`), Favicons (`favicon.ico`, 16x16, 32x32, `apple-touch-icon.png`), `vzug-partner-badge.png`, CSS (`/_astro/Layout.*.css`) und die generierten WebP-Bildvarianten (`/_astro/*.webp`) liefern alle `HTTP 200` mit plausiblen Content-Types.
- WhatsApp-Button ist im ausgelieferten HTML vorhanden (`wa.me/41764252050`, vorbefüllter Text), CSP erlaubt die nötigen `self`-Ressourcen sowie das Google-Maps-`frame-src` und `form-action` zu web3forms – keine durch CSP blockierten Ressourcen gefunden.
- Security-Header (HSTS, X-Frame-Options, X-Content-Type-Options, CSP) sind auf `www` aktiv wie in `public/.htaccess` vorgesehen.

### Bildkomprimierung – ein Ausreisser bei der Hero-Grafik
- Die Showroom-Bilder (`quality={70}` im Code) sind klein und sauber (z. B. 300–640px-Varianten im niedrigen zweistelligen bis niedrigen dreistelligen KB-Bereich).
- Das Hero-Bild (`hero-standort.jpg`, in `index.astro` **ohne** explizites `quality`-Prop, `loading="eager" fetchpriority="high"`, `sizes="100vw"`) springt bei der grössten generierten Variante drastisch: 640w ≈ 66 KB, 1024w ≈ 161 KB, **1600w ≈ 1.49 MB**. Das ist eine ca. 9-fache Grössenzunahme für nur 1.6x mehr Breite – der Sprung deutet darauf hin, dass die Standard-Qualität (Astro-Default ~80) bei diesem detailreichen Motiv (Gebäude/Fassade) schlecht komprimiert.
- Da dieses Bild mit `fetchpriority="high"` und `sizes="100vw"` eager geladen wird, bekommen breite Viewports/Retina-Displays (>1024px CSS-Breite bzw. DPR 2 bei ~800px) das 1.49-MB-Bild direkt beim Seitenaufruf ausgeliefert – das verzögert LCP unnötig, gerade weil es das prioritär geladene Bild über dem Fold ist. Empfehlung: `quality` (z. B. 75–80) explizit setzen und/oder Bildvariante neu exportieren, um die 1600w-Version in einen ähnlichen Grössenbereich wie die anderen Stufen zu bringen.

### Layout-Unterschied, der nur in Produktion auftritt
- Interne Links im Code verwenden durchgehend Pfade ohne trailing slash (`href="/ueber-uns"`, `href="/geraeteanfrage"` etc., siehe `Header.astro`, `Footer.astro`, CTAs in `index.astro`/`ueber-uns.astro`). Auf dem Produktionsserver antwortet der Apache/nginx-Stack darauf mit **301-Redirects auf die Pfade mit trailing slash** (`/ueber-uns` → `/ueber-uns/`, ebenso `/geraeteanfrage`, `/danke`, `/impressum`, `/datenschutz`). Im lokalen Astro-Dev-Server passiert das nicht (dort wird direkt ausgeliefert), auf der Live-Seite bedeutet jeder interne Klick einen zusätzlichen Redirect-Hop. Kein Show-Stopper, aber unnötige Latenz und nicht das, was im Quellcode beabsichtigt war; liesse sich durch direkte Verlinkung mit trailing slash oder eine Rewrite-Regel vermeiden.

### Informationshierarchie
- Auf Startseite, "Über uns" und "Geräteanfrage" entspricht die ausgelieferte Struktur (H1 → Kicker → Sections in der Reihenfolge Hero, Trust-Leiste, Gerätebereiche, Showroom, Beratung/Service, Partner/Rezepte) exakt dem, was der Quellcode vorsieht. Formular-Felder, Pflichtfeld-Kennzeichnung, Google-Maps-Embed und Timeline-Meilensteine (1933–heute) sind inhaltlich vollständig und in der erwarteten Reihenfolge vorhanden. Keine fehlenden oder vertauschten Abschnitte festgestellt.

## Zusammenfassung der Prioritäten
1. **Sofort (kritisch, Hosting):** SSL-Zertifikat + Redirect für die Apex-Domain `vzugshop.ch` fixen – aktuell für die meisten Erstbesucher faktisch offline/unsicher, trotz korrekter kanonischer URLs im Code.
2. **Bald (Performance):** Hero-Bild-Kompression bei der 1600w-Variante prüfen/`quality` setzen.
3. **Kann warten (Politur):** Trailing-Slash-Redirects durch direkte Verlinkung vermeiden.
