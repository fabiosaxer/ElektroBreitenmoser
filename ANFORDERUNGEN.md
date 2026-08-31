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

- Formular: Name, Kontakt (Telefon/E-Mail), gewünschtes Gerät/Kategorie, Nachricht
- Versand an info@elektrobreitenmoser.ch über Formular-Service (siehe Abschnitt 6)
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
- Formular-Backend: Formspree (Alternative: Web3Forms) – Account und Form-ID/Access-Key müssen noch angelegt/bereitgestellt werden
- Versionskontrolle: GitHub-Repo `fabiosaxer/ElektroBreitenmoser`
- Deployment: GitHub Actions baut bei jedem Push auf `main` die statische Seite (`npm run build`) und veröffentlicht das Ergebnis in den Branch `dist`. Plesk (Hosttime) bindet diesen Branch per Git-Integration ein und dient ihn direkt aus dem Document Root aus.
- Kein Node.js/Build-Prozess auf dem Produktivserver nötig – nur statische Dateien landen dort.

## 7. Rechtliches / Compliance (Schweiz)

- Impressumspflicht: Firmenname, Adresse, Handelsregister-Nr., UID (falls vorhanden), verantwortliche Person
- Datenschutzerklärung (DSG) nötig, sobald Formulardaten über einen externen Dienst (Formspree/Web3Forms) verarbeitet werden
- Cookie-Hinweis nur nötig, falls Tracking/Analytics eingesetzt wird (aktuell nicht vorgesehen)

## 8. Offene Punkte (mit Fabio/Kunde zu klären)

- [ ] Formspree- oder Web3Forms-Account erstellen, Form-Endpoint/Access-Key liefern
- [ ] Finale Bild-/Logo-Assets in hoher Auflösung beschaffen
- [ ] Zugang zu Plesk bei Hosttime für Domain `elektrobreitenmoser.ch` (Git-Integration einrichten)
- [ ] Impressums-Daten (Handelsregisternummer, UID, verantwortliche Person)
- [ ] Google-Maps-Embed bzw. Standort-Widget gewünscht?
- [ ] Mehrsprachigkeit nötig, oder reicht Deutsch? (aktuell: nur Deutsch angenommen)
- [ ] Datenschutzfreundliche Analytics gewünscht (z. B. Plausible)?

## 9. Vorerst nicht im Scope

- Online-Shop / Warenkorb
- Kundenkonto-Bereich
- Mehrsprachigkeit
