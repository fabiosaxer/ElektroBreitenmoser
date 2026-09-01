# Live-Audit QA – vzugshop.ch (Stand 2026-09-01)

Geprüft per curl/openssl (DNS, TLS, HTTP-Status, ausgeliefertes HTML) gegen die produktive Domain. Getestete Seiten: `/`, `/ueber-uns/`, `/geraeteanfrage/`, `/danke/`, `/impressum/`, `/datenschutz/` sowie `robots.txt`/`sitemap.xml`.

## Kritisch

1. **Naked Domain `vzugshop.ch` (ohne www) ist komplett offline.**
   `vzugshop.ch` löst per DNS auf `185.101.158.113` auf – ein anderer Server als `www.vzugshop.ch` (`80.74.142.125`). Auf Port 80 kommt "Empty reply from server", auf Port 443 wird ein **abgelaufenes Let's-Encrypt-Zertifikat für eine fremde Domain (`CN=mibraflex.de`, abgelaufen seit 2. April 2021)** ausgeliefert. Jeder Aufruf von `https://vzugshop.ch/…` (mit oder ohne Pfad) scheitert für echte Nutzer mit einer TLS-Sicherheitswarnung bzw. Verbindungsfehler – reproduzierbar bei mehrfachem Test. Nur `https://www.vzugshop.ch` funktioniert (gültiges Zertifikat `CN=vzugshop.ch`, Server nginx, HTTP→HTTPS-Redirect 301 vorhanden).
   → DNS-A-Record für die Naked Domain muss auf denselben Host wie `www` zeigen bzw. dort ein funktionierender Redirect/vHost mit gültigem Zertifikat eingerichtet werden. **Site-weit blockierend, höchste Priorität.**

2. **Web3Forms-Redirect nach Formularversand zeigt auf die kaputte Naked Domain.**
   `astro.config.mjs` setzt `site: 'https://vzugshop.ch'` (ohne www). Das `redirect`-Hidden-Field im Formular wird daraus gebaut (`new URL('/danke', Astro.site)`) und liefert im ausgelieferten HTML `value="https://vzugshop.ch/danke"`. Da diese Domain laut Punkt 1 nicht erreichbar ist, landet jeder Nutzer nach erfolgreichem Absenden des Formulars auf einer kaputten Seite/TLS-Fehler statt auf der Danke-Seite – obwohl die E-Mail bei Web3Forms/Empfänger vermutlich trotzdem ankommt. **Das Formular ist damit aus Nutzersicht nicht als "funktionierend" wahrnehmbar.**
   → Entweder Naked Domain reparieren (Punkt 1) oder `site` in `astro.config.mjs` auf `https://www.vzugshop.ch` setzen (und konsistent bei Canonicals/JSON-LD/Sitemap/robots.txt), oder das Redirect-Feld hart auf die www-Domain setzen.

3. **Sicherheits-Header (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) werden live nicht ausgeliefert.**
   `public/.htaccess` enthält alle Header inkl. CSP mit `frame-src https://www.google.com` (für das Maps-Embed) – aber der Live-Server antwortet mit `server: nginx`. `.htaccess` wird nur von Apache (`mod_headers`/`mod_rewrite`) ausgewertet und hat auf nginx keine Wirkung. Tatsächliche Response-Header von `https://www.vzugshop.ch/` enthalten **keinen** der genannten Header. Das bedeutet: keine CSP-Absicherung, kein HSTS, keine Clickjacking-Absicherung (X-Frame-Options) im Betrieb – die im Code dokumentierte Sicherheitsstrategie ist wirkungslos.
   → Header serverseitig äquivalent in der nginx-Config (oder im Hosting-Panel) nachbilden, `.htaccess` kann entfallen. Funktional unkritisch (Maps-Iframe lädt trotzdem, da nichts blockiert), aber sicherheitsrelevant.

## Wichtig

4. **Sitemap/robots.txt/Canonical/JSON-LD zeigen konsequent auf die Naked Domain.**
   `robots.txt` → `Sitemap: https://vzugshop.ch/sitemap.xml`; `sitemap.xml` listet alle URLs mit `https://vzugshop.ch/...` (ohne www, teils ohne trailing slash); jede Seite trägt `<link rel="canonical" href="https://vzugshop.ch/...">` und JSON-LD `"url":"https://vzugshop.ch/"`. Solange Punkt 1 nicht behoben ist, kann Google die Sitemap nicht crawlen und die kanonische URL ist nicht erreichbar – SEO-Indexierung ist blockiert. Selbst nach Fix von Punkt 1 bleibt die Inkonsistenz "ausgeliefert unter www, kanonisch ohne www" bestehen, was zu Duplicate-Content-Risiken führen kann, falls nicht auch die Naked Domain dauerhaft auf www weiterleitet (oder umgekehrt).
   → Nach DNS-Fix: entscheiden, welche Version (mit/ohne www) die "eine" Domain ist, konsistent 301-weiterleiten und `astro.config.mjs`/Sitemap/robots.txt/Canonicals darauf ausrichten.

5. **`sitemap-index.xml` liefert 404.** Die im Projekt dokumentierte Erwartung (typischer Astro-Sitemap-Output) existiert live nicht – es gibt nur eine einzelne `sitemap.xml`. Kein Funktionsfehler, aber falls extern (z. B. Search Console) auf `sitemap-index.xml` verwiesen wurde, sollte das korrigiert werden.

6. **Formular-Redirect-URL ohne trailing slash.** `redirect` zeigt auf `.../danke` statt `.../danke/`; die interne Seite existiert nur unter `/danke/` (Canonical) und liefert bei `/danke` einen 301-Redirect. Funktioniert im Browser (folgt dem Redirect automatisch), ist aber ein unnötiger Extra-Hop und inkonsistent mit dem restlichen `trailingSlash`-Schema der Seite.

## Nice-to-have

7. **Navigations-/Footer-Links intern ohne trailing slash** (`/ueber-uns`, `/geraeteanfrage`, `/impressum`, `/datenschutz`). Alle wurden getestet und liefern korrekt 301 → kanonische Version mit Slash. Kein Bruch, aber jeder Klick verursacht einen unnötigen Redirect-Hop; direkte Verlinkung mit Slash wäre etwas schneller und SEO-sauberer.

8. **Heading-Hierarchie:** Auf allen geprüften Seiten sauber (h1 → h2 → h3, keine übersprungenen Ebenen im Hauptcontent). Footer nutzt für seine vier Spaltentitel `h3` auch auf Seiten, die im Hauptcontent nur ein `h1` haben (z. B. Impressum, Danke) – das ist bei Footer-Landmarken allgemein akzeptabel, könnte aber strenger interpretiert als übersprungene Ebene gewertet werden. Kein WCAG-Fail, nur zur Kenntnis.

9. **Alt-Texte und Label-Zuordnung im Formular sind vorbildlich:** Alle geprüften `<img>` haben aussagekräftige, kontextspezifische Alt-Texte; jedes Formularfeld hat ein zugeordnetes `<label for>`; Pflichtfelder sind mit `*` und `required` markiert und im Klartext erklärt ("Mit * markierte Felder sind Pflichtfelder."); sichtbare Fokus-Stile (`focus:ring-2 focus:ring-brand`) sind an allen Eingabefeldern vorhanden. Keine Korrektur nötig.

10. **WhatsApp-Floating-Button:** Im ausgelieferten HTML auf allen geprüften Seiten vorhanden, Link `https://wa.me/41764252050?text=...` korrekt URL-encodiert, `target="_blank"` mit `rel="noopener noreferrer"`, `aria-label` mit Telefonnummer vorhanden. Keine Korrektur nötig.

11. **Google-Maps-Iframe** (`/geraeteanfrage/`): `src="https://www.google.com/maps?q=...&output=embed"`, `loading="lazy"`, `title` gesetzt, `referrerpolicy="no-referrer-when-downgrade"`. Passt syntaktisch zur geplanten CSP (`frame-src https://www.google.com`); lädt aktuell ohnehin ungehindert, da CSP live nicht aktiv ist (siehe Punkt 3).

## Web3Forms-Feldcheck (Detail zu Punkt 2)

Im ausgelieferten HTML von `/geraeteanfrage/` korrekt vorhanden:
- `<form action="https://api.web3forms.com/submit" method="POST">`
- `<input type="hidden" name="access_key" value="b82697eb-f0f3-4c3f-b9f1-9073e53d8d7a">`
- `<input type="hidden" name="redirect" value="https://vzugshop.ch/danke">` ← Ziel aktuell nicht erreichbar (siehe Kritisch #1/#2)
- Honeypot `botcheck` korrekt versteckt (`tabindex="-1"`, `aria-hidden="true"`, `class="hidden"`)
- Alle Pflichtfelder (`name`, `email`, `device`, `message`) mit `required` und Label

Der POST an `api.web3forms.com` selbst ist unabhängig von der vzugshop.ch-DNS-Misere und sollte funktionieren; das Problem liegt ausschliesslich im Redirect-Ziel nach dem Absenden.
