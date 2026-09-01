# Anforderungen – Website Elektro Breitenmoser AG

## 1. Ausgangslage

- Bestehender Prototyp: WordPress-Seite unter https://vzugeb.saxer.sg (dient als Inhalts-/Struktur-Referenz, wird durch dieses Projekt abgelöst)
- Firma: Elektro Breitenmoser AG, Fortunastrasse 2, CH-9437 Marbach
- Fachhändler und Servicepartner für V-ZUG Küchen- und Waschereigeräte, seit fast 100 Jahren im Rheintal tätig

## 2. Ziele

- Professioneller, moderner Auftritt, der Vertrauen und Kompetenz vermittelt
- Schnelle Ladezeiten, gute Auffindbarkeit (SEO), mobile-first
- Einfache Wartung/Erweiterung (Code-basiert statt WordPress-Plugins)
- Klarer Kontaktkanal für Geräteanfragen

## 3. Zielgruppe

- Privatkunden in der Region Rheintal/Ostschweiz, die V-ZUG Geräte kaufen oder sich beraten lassen wollen
- Bestehende Kunden, die Service/Support suchen

## 4. Seitenstruktur (Sitemap)

1. Start (Home)
2. Inspiration
3. Geräteanfrage (Kontaktformular)
4. Footer-Seiten: Impressum, Datenschutz (rechtlich in der Schweiz nötig)

### 4.1 Start

- Hero mit Slogan + CTA (Telefonnummer 071 777 12 76 / Anfrage stellen)
- Vorstellung als V-ZUG Partner, persönliche Beratung im Vordergrund
- Über V-ZUG: Schweizer Herkunft seit 1913, nachhaltige Produktion, Werk Sulgen (eröffnet 2022, CO2-neutrale Kühlgeräteproduktion, "modernste Kühlgerätefabrik Europas")
- Serviceleistungen: Geräteservice, Versand in die ganze Schweiz
- Standort/Kontakt-Teaser (Karte)
- Hinweis: kein Ersatzteil-Direktverkauf ab Lager (V-ZUG direkt: 058 767 67 84)

### 4.2 Inspiration

- Bildergalerie / Produktinspiration (Küchen, Geräte im Einsatz, Referenzprojekte)
- Optional: Verlinkung auf V-ZUG Produktwelten/Kataloge

### 4.3 Geräteanfrage

- Formular: Name, Kontakt (Telefon/E-Mail), gewünschtes Gerät/Kategorie, Budgetrahmen (optional), Nachricht
- Versand an info@vzugshop.ch über Web3Forms (siehe Abschnitt 6)
- Erfolgsmeldung/Bestätigung nach Absenden, verständliche Fehlermeldung bei Problemen

### 4.4 Footer (auf allen Seiten)

- Adresse, Telefon, E-Mail, Öffnungszeiten (nach Vereinbarung / Showroom ggf. tagsüber geschlossen)
- Social-Media-Link: Instagram @breitenmoserag_vzug
- Links: Impressum, Datenschutzerklärung

## 5. Design & Branding

- Offen: Logo, Farbwelt, Bildmaterial – vom bestehenden WordPress-Prototyp übernehmen oder neu gestalten
- Tonalität: professionell, seriös, lokal verwurzelt, Deutsch (Schweizer Hochdeutsch)

## 6. Technischer Stack

- Framework: [Astro](https://astro.build) (statischer Seitengenerator) + Tailwind CSS, TypeScript
- Formular-Backend: [Web3Forms](https://web3forms.com) – Access Key muss noch angelegt und in `src/pages/geraeteanfrage.astro` eingetragen werden (siehe README.md, Abschnitt "Kontaktformular")
- Versionskontrolle: GitHub-Repo `fabiosaxer/ElektroBreitenmoser`
- Deployment: GitHub Actions baut bei jedem Push auf `main` die statische Seite (`npm run build`) und veröffentlicht das Ergebnis in den Branch `dist`. Plesk (Hosttime) bindet diesen Branch per Git-Integration ein und dient ihn direkt aus dem Document Root aus.
- Kein Node.js/Build-Prozess auf dem Produktivserver nötig – nur statische Dateien landen dort.

## 6a. Domain & E-Mail

- **Hauptdomain:** `vzugshop.ch` (steuert `astro.config.mjs` → `site`, Canonical-Tags, JSON-LD, `sitemap.xml`, `robots.txt`)
- **Alias-Domains:** `elektrobreitenmoser.ch` und `vzug-spezialist.ch` sollen ebenfalls auf diese Website zeigen – als 301-Redirect auf `vzugshop.ch` beim jeweiligen Domain-Provider/in Plesk einrichten (nicht als separate Kopie hosten, sonst Duplicate-Content-Risiko bei Google)
- **Kontaktformular-E-Mail:** `info@vzugshop.ch`, gehostet bei Microsoft 365 – Web3Forms sendet die Benachrichtigungsmail an diese Adresse; sie landet damit im M365-Postfach. Eine echte Versandroute *über* M365 (SMTP-Relay statt nur Empfang) wäre über Power Automate möglich, ist aber ein separater, manueller Zusatzschritt (siehe README.md)

## 7. Rechtliches / Compliance (Schweiz)

- Impressumspflicht: Firmenname, Adresse, Handelsregister-Nr., UID (falls vorhanden), verantwortliche Person
- Datenschutzerklärung (DSG) nötig, sobald Formulardaten über einen externen Dienst (Formspree/Web3Forms) verarbeitet werden
- Cookie-Hinweis nur nötig, falls Tracking/Analytics eingesetzt wird (aktuell nicht vorgesehen)

## 8. Offene Punkte (mit Fabio/Kunde zu klären)

- [x] Web3Forms-Account erstellen, Access-Key liefern (siehe README.md, Abschnitt "Kontaktformular")
- [x] Finale Bild-/Logo-Assets in hoher Auflösung beschafft (siehe `pictures/`, kuratierte Auswahl in `src/assets/images` und `public/`)
- [x] Hauptdomain bestätigt: `vzugshop.ch` (Alias: `elektrobreitenmoser.ch`, `vzug-spezialist.ch`)
- [ ] Zugang zu Plesk bei Hosttime für Domain `vzugshop.ch` (Git-Integration einrichten) – übernimmt Fabio selbst
- [ ] 301-Redirects von `elektrobreitenmoser.ch` und `vzug-spezialist.ch` auf `vzugshop.ch` einrichten
- [x] UID: CHE-108.098.718
- [x] Handelsregisternummer: CH-320-3014903-8
- [x] Verantwortliche Person: Daniel Benz
- [x] Firmengeschichte/Meilensteine für "Über uns"-Zeitstrahl (Zeitungsartikel erhalten, Gründungsjahr 1933 gesetzt)
- [x] Google-Maps-Embed auf der Geräteanfrage-Seite ergänzt
- [ ] Mehrsprachigkeit nötig, oder reicht Deutsch? (aktuell: nur Deutsch angenommen)
- [ ] Datenschutzfreundliche Analytics gewünscht (z. B. Plausible)?

## 9. Vorerst nicht im Scope

- Online-Shop / Warenkorb
- Kundenkonto-Bereich
- Mehrsprachigkeit
