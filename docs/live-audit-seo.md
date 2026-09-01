# Live-Audit: vzugshop.ch (SEO, Produktion)

Datum: 2026-09-01
Geprüft: `https://vzugshop.ch/`, `/ueber-uns/`, `/geraeteanfrage/`, `/impressum/`, `/datenschutz/`, `/robots.txt`, `/sitemap.xml`, `https://www.vzugshop.ch/` — per `curl`/`openssl` direkt gegen den Produktionsserver (IP `80.74.142.125`, `server: nginx`), Ergebnisse mit dem ausgelieferten Quellcode (`src/layouts/Layout.astro`, `public/sitemap.xml`, `public/robots.txt`) abgeglichen.

**Methodik-Hinweis:** Der Standard-DNS-Resolver dieses Rechners/Netzwerks liefert für `vzugshop.ch` aktuell eine veraltete/falsche IP (`185.101.158.113`, hosttech.eu-Parkseite mit einem seit 2021 abgelaufenen Fremdzertifikat für `mibraflex.de`) und cachet das mit TTL ~4200s. Öffentliche Resolver (`8.8.8.8`, `1.1.1.1`) lösen sowohl `vzugshop.ch` als auch `www.vzugshop.ch` korrekt zu `80.74.142.125` auf, mit gültigem, am 2026-09-01 ausgestelltem Let's-Encrypt-Zertifikat für `CN=vzugshop.ch` (gültig bis 2026-11-30). Alle Befunde unten stammen aus expliziten Requests gegen die öffentlich korrekte IP (`curl --resolve ...`). Das bedeutet vermutlich auch, dass der Befund "Apex-Domain komplett tot" in `docs/live-audit-design.md` derselbe lokale DNS-Cache-Effekt war und nicht (mehr) den Produktionsstand widerspiegelt — bitte von einem anderen Netzwerk/Gerät gegenprüfen, bevor daran weitergearbeitet wird.

**Nebenbefund ausserhalb SEO-Scope:** Die in `public/.htaccess` definierten Security-Header (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) kommen in den tatsächlichen Produktions-Responses (weder auf Apex noch auf `www`) nicht an — `curl -D -` zeigt nur nginx-Standardheader. Das deutet darauf hin, dass `.htaccess` vom aktuellen Hosting-Setup (nginx) für statische Dateien nicht ausgewertet wird. Kein direkter Ranking-Faktor, aber HSTS trägt zu Trust-Signalen bei; Weitergabe an Hosting/Security empfohlen (siehe auch `docs/security-report.md`).

---

## Priorität 1 — Schnell behebbar, direkter SEO-Nutzen

### 1.1 Sitemap-URLs ohne Trailing Slash → unnötiger Redirect-Hop zur Canonical-URL

**Bestätigt:** `https://vzugshop.ch/sitemap.xml` listet `.../ueber-uns`, `.../geraeteanfrage`, `.../impressum`, `.../datenschutz` ohne abschliessenden Slash. Der Server liefert dafür `301` auf die Version mit Slash:

```
$ curl -sk https://vzugshop.ch/ueber-uns
HTTP/2 301
location: https://vzugshop.ch/ueber-uns/
```

...welche auch exakt der ausgelieferte `<link rel="canonical">`-Wert ist (verifiziert auf allen vier Unterseiten). Crawler müssen also für jede Sitemap-URL (ausser der Startseite) einen zusätzlichen Hop machen, bevor sie die kanonische URL erreichen — unnötig, kostet Crawl-Budget und ist ein leicht vermeidbares Signal-Rauschen.

**Fix:** `public/sitemap.xml` mit Trailing Slashes analog zu den Canonical-Tags:

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

Falls die Sitemap künftig generiert statt manuell gepflegt wird: sicherstellen, dass der Generator dieselbe Trailing-Slash-Konvention wie `Astro.url.pathname`/`canonicalUrl` in `Layout.astro` verwendet, damit das nicht erneut auseinanderläuft.

### 1.2 `www.vzugshop.ch` liefert 200 ohne Redirect auf die kanonische Domain

**Bestätigt:**
```
$ curl -sk --resolve www.vzugshop.ch:443:80.74.142.125 -o /dev/null -w "%{http_code}" https://www.vzugshop.ch/
200
```
Der Inhalt ist identisch zu `https://vzugshop.ch/` (gleiche `content-length`, gleicher `etag`), und das `<link rel="canonical">` zeigt korrekt auf `https://vzugshop.ch/` (nicht-www) — das mindert das Duplicate-Content-Risiko, ersetzt aber keinen echten Host-Redirect. Ohne 301 kann Google beide Hosts crawlen/indexieren (Crawl-Budget-Verschwendung) und externe Links/Backlinks können sich auf zwei verschiedene URLs verteilen statt Linksignale auf eine zu bündeln.

`astro.config.mjs` legt `vzugshop.ch` (ohne www) explizit als Hauptdomain fest — das ist also die gewünschte Zielrichtung.

**Fix (serverseitig, kein Code-Fix im Repo möglich, da `.htaccess` hier nachweislich nicht greift — siehe Methodik-Hinweis):**

Bevorzugt in Plesk/Hosting-Panel: Domain-Einstellungen für `www.vzugshop.ch` → "Permanent SEO-safe 301 redirect" auf `vzugshop.ch` aktivieren (oder äquivalente Preferred-Domain-Einstellung).

Falls direkter nginx-Zugriff möglich ist, alternativ als eigener Server-Block:

```nginx
server {
    listen 443 ssl http2;
    server_name www.vzugshop.ch;
    ssl_certificate     /pfad/zu/vzugshop.ch/fullchain.pem;
    ssl_certificate_key /pfad/zu/vzugshop.ch/privkey.pem;
    return 301 https://vzugshop.ch$request_uri;
}
```

Zusätzlich als Defense-in-Depth in `public/.htaccess` ergänzen (schadet nicht, falls Apache das Setup doch mal wieder verarbeitet), vor der bestehenden HTTPS-Regel:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTP_HOST} ^www\.vzugshop\.ch$ [NC]
  RewriteRule ^ https://vzugshop.ch%{REQUEST_URI} [L,R=301]

  RewriteCond %{HTTPS} off
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

---

## Priorität 2 — Fehlende Open-Graph-/Twitter-Card-Tags

**Bestätigt:** Keine `og:*`- oder `twitter:*`-Meta-Tags im ausgelieferten `<head>` auf allen fünf geprüften Seiten (weder in `Layout.astro` noch im Live-HTML).

**Einschätzung der Relevanz für diese Seite:** Hoch — nicht "nice to have". `WhatsAppButton.astro` bewirbt WhatsApp-Kontakt prominent auf jeder Seite, und die Zielgruppe (private Endkunden im Rheintal) wird die Seite mit hoher Wahrscheinlichkeit per WhatsApp-Chat oder in sozialen Netzwerken teilen ("schau dir mal den Fachhändler an", Geräteanfrage-Link an Familie weiterleiten, Instagram-Verlinkung aus dem JSON-LD `sameAs`). Ohne OG-Tags zeigt WhatsApp/Facebook/Instagram/LinkedIn beim Teilen eines Links entweder gar keine Vorschau oder nur eine generische URL-Karte ohne Titel/Bild — das senkt die Klickrate auf geteilte Links spürbar. Auch wenn OG-Tags kein direkter Google-Ranking-Faktor sind, sind sie hier über den Social-/Messaging-Traffic-Kanal SEO-relevant (Referral-Traffic, Markenwahrnehmung, CTR).

**Fix — Ergänzung in `src/layouts/Layout.astro`:**

```astro
---
// ... bestehende Imports ...

interface Props {
	title: string;
	description?: string;
	noindex?: boolean;
	ogImage?: string;
}

const {
	title,
	description = 'Elektro Breitenmoser AG – Ihr V-ZUG Fachhändler und Servicepartner in Marbach (Rheintal).',
	noindex = false,
	ogImage = '/og-default.jpg',
} = Astro.props;

const canonicalUrl = new URL(Astro.url.pathname, Astro.site);
const ogImageUrl = new URL(ogImage, Astro.site).toString();
const pageTitle = `${title} · Elektro Breitenmoser AG`;

// ... localBusinessJsonLd bleibt unverändert ...
---

<html lang="de-CH">
	<head>
		<meta charset="utf-8" />
		<!-- ... bestehende Icons/Meta ... -->
		<meta name="description" content={description} />
		{noindex && <meta name="robots" content="noindex, nofollow" />}
		<link rel="canonical" href={canonicalUrl} />
		<title>{pageTitle}</title>

		<!-- Open Graph -->
		<meta property="og:type" content="website" />
		<meta property="og:site_name" content="Elektro Breitenmoser AG" />
		<meta property="og:locale" content="de_CH" />
		<meta property="og:title" content={pageTitle} />
		<meta property="og:description" content={description} />
		<meta property="og:url" content={canonicalUrl} />
		<meta property="og:image" content={ogImageUrl} />
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />

		<!-- Twitter/X Card (WhatsApp/Facebook nutzen primär og:*, Twitter-Tags als Fallback) -->
		<meta name="twitter:card" content="summary_large_image" />
		<meta name="twitter:title" content={pageTitle} />
		<meta name="twitter:description" content={description} />
		<meta name="twitter:image" content={ogImageUrl} />

		<script type="application/ld+json" set:html={JSON.stringify(localBusinessJsonLd)} />
	</head>
	<!-- ... body unverändert ... -->
</html>
```

**Zusätzlich benötigt — Bild-Asset (kein Text-Fix, an frontend-developer/Design übergeben):**
- Neue Datei `public/og-default.jpg`, **1200×630px** (1.91:1-Ratio, Standard für WhatsApp/Facebook/LinkedIn-Vorschaubilder), als JPG (nicht WebP — Link-Scraper von WhatsApp/Facebook unterstützen WebP inkonsistent), Zielgrösse < 300 KB.
- Inhaltlich eignet sich das bestehende `hero-standort.jpg` (Showroom-Aussenansicht) als Basis, ggf. mit Logo-Overlay/Schriftzug "V-ZUG Fachhändler Marbach", statt nur `logo.png` zu verwenden — ein reines Logo auf 1200×630 wirkt bei diesem Seitenverhältnis meist winzig und leer.
- Optional: seitenspezifisches `ogImage`-Prop nutzen, falls für `/geraeteanfrage/` (z. B. Formularseite) oder `/ueber-uns/` (Team-/Gebäudebild) ein passenderes Bild gewünscht ist; Default reicht für den Start.

---

## Priorität 3 — Optionale Politur (kein akuter Handlungsbedarf)

- **JSON-LD-Typ verfeinern:** Aktuell `"@type": "LocalBusiness"` (generisch, aber valide). Für ein Fachgeschäft mit Verkauf könnte `"@type": "ElectronicsStore"` (Subtyp von `LocalBusiness`) für Google eine treffendere Kategorisierung liefern. Optional `priceRange` ergänzen (z. B. `"$$"`/`"CHF"`-Bereich), falls gewünscht — nicht erforderlich, aktuelles Markup ist bereits valide und vollständig genug für Rich-Result-Eligibility.
- **`lastmod` in der Sitemap:** Aktuell für alle URLs identisch auf das Build-/Deploy-Datum gesetzt statt auf das tatsächliche letzte inhaltliche Änderungsdatum pro Seite. Kein Fehler, aber langfristig aussagekräftiger, falls sich Inhalte einzelner Seiten unterschiedlich oft ändern.

---

## Verifiziert, kein Handlungsbedarf (Bestätigung bestehender Umsetzung)

| Seite | Title (Länge) | Meta-Description (Länge) | H1 | Canonical | JSON-LD |
|---|---|---|---|---|---|
| `/` | „V-ZUG Fachhändler Marbach · Elektro Breitenmoser AG" (51) | 147 Zeichen, einzigartig | 1× „Ihr V-ZUG Fachhändler in Marbach" | `https://vzugshop.ch/` | ✅ valide, im `<head>` |
| `/ueber-uns/` | „Über uns – V-ZUG Regionalpartner · Elektro Breitenmoser AG" (58) | 108 Zeichen | 1× „Über uns" | `https://vzugshop.ch/ueber-uns/` | ✅ |
| `/geraeteanfrage/` | „V-ZUG Geräteanfrage Marbach · Elektro Breitenmoser AG" (53) | 154 Zeichen | 1× „Geräteanfrage" | `https://vzugshop.ch/geraeteanfrage/` | ✅ |
| `/impressum/` | „Impressum · Elektro Breitenmoser AG" (35) | 144 Zeichen | 1× „Impressum" | `https://vzugshop.ch/impressum/` | ✅ |
| `/datenschutz/` | „Datenschutz · Elektro Breitenmoser AG" (37) | 140 Zeichen | 1× „Datenschutzerklärung" | `https://vzugshop.ch/datenschutz/` | ✅ |

- Alle Titles liegen im empfohlenen 35–60-Zeichen-Bereich und sind pro Seite eindeutig; alle Meta-Descriptions liegen im 108–154-Zeichen-Bereich (Zielkorridor ~150–160) und sind nicht dupliziert.
- Genau ein `<h1>` pro Seite, sinnvolle `<h2>`-Unterstruktur (z. B. `/ueber-uns/`: chronologische Firmengeschichte 1933–heute als H2-Abfolge; `/` sauber nach Sektionen gegliedert).
- `robots.txt` korrekt erreichbar, `Allow: /`, verweist korrekt auf `https://vzugshop.ch/sitemap.xml`.
- `application/ld+json` (LocalBusiness: Name, Adresse, Telefon, E-Mail, `taxID`, `areaServed`, `sameAs`) wird serverseitig im `<head>` ausgeliefert, ist syntaktisch valides JSON und stimmt exakt mit dem Quellcode überein — auf allen fünf geprüften Seiten identisch vorhanden.
- HTTP→HTTPS-Redirect funktioniert (`http://vzugshop.ch/` → 301 → `https://vzugshop.ch/`).

---

## Zusammenfassung der Prioritäten

1. **P1 – `public/sitemap.xml`**: Trailing Slashes ergänzen (Code-Fix oben, sofort umsetzbar).
2. **P1 – `www` → Apex 301**: Serverseitige Weiterleitung einrichten (Hosting/Plesk oder nginx-Konfiguration, kein reiner Code-Fix).
3. **P2 – OG-/Twitter-Tags**: Snippet in `Layout.astro` ergänzen + `public/og-default.jpg` (1200×630) erstellen lassen — hohe Relevanz wegen prominenter WhatsApp-Teilen-Nutzung.
4. **P3 – optional**: JSON-LD-`@type` verfeinern, `lastmod` pro Seite präzisieren.
5. **Cross-Check nötig**: lokaler DNS-Cache-Effekt vs. tatsächlicher Produktionsstand (siehe Methodik-Hinweis) und fehlende Security-Header trotz `public/.htaccess` (Nebenbefund, an Hosting/Security weiterreichen).
