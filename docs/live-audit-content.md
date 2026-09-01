# Live-Audit: Content-Korrekturlesung & Konsistenz

Geprüft am 01.09.2026 auf den live erreichbaren Seiten:
`/`, `/ueber-uns/`, `/geraeteanfrage/`, `/impressum/`, `/datenschutz/`, `/danke/`.

Methode: WebFetch + Rohtext-/HTML-Extraktion (curl + Skript) für exakte
Zitate, gezielte grep-Suche nach Platzhaltermustern (TODO, Lorem ipsum,
Platzhalter, XXX, FIXME, TBD, "coming soon" o.ä.) und nach Text, der
unmittelbar ohne Leerzeichen an `<a>`-Links anschliesst.

## 0. Kritischer Befund: Apex-Domain `vzugshop.ch` (ohne www) nicht erreichbar

Alle sechs vom Auftrag genannten URLs verwenden die Schreibweise ohne
`www.` (z. B. `https://vzugshop.ch/`). Diese Variante ist **nicht sicher
erreichbar**:

- `https://vzugshop.ch/` liefert beim TLS-Handshake ein **fremdes,
  seit 2021 abgelaufenes Zertifikat** (`CN=mibraflex.de`, gültig
  02.01.2021–02.04.2021, Let's Encrypt) – offensichtlich das
  Hosttech-Default-Zertifikat des Servers, nicht das der eigenen Domain.
  Jeder Browser zeigt hier eine Sicherheitswarnung bzw. bricht die
  Verbindung ab (in Tests: „empty reply from server").
- `http://vzugshop.ch/` (Port 80, ohne TLS) antwortet gar nicht
  (kein Response, kein Redirect).
- Im Unterschied dazu funktioniert **`https://www.vzugshop.ch/`**
  einwandfrei: gültiges, aktuelles Zertifikat (`CN=vzugshop.ch`,
  ausgestellt 01.09.2026, gültig bis 30.11.2026), `http://www.vzugshop.ch/`
  leitet korrekt per 301 auf `https://www.vzugshop.ch/` weiter.

**Konsequenz:** Besucher, die die Domain ohne „www" eingeben oder ihr
Browser-Autocomplete nutzen (üblich, da die meisten Nutzer auf Mobilgeräten
„vzugshop.ch" ohne www eintippen), landen auf einer Zertifikatswarnung
oder einem Verbindungsfehler statt auf der Seite. Das ist unabhängig vom
Content der dringendste Punkt vor einem echten Launch: entweder einen
301-Redirect von der nackten Domain auf `www.` einrichten (inkl. gültigem
Zertifikat für die Apex-Domain, das den Handshake übersteht, bevor der
Redirect greifen kann) oder DNS/Hosting so konfigurieren, dass die
Apex-Domain direkt mit einem gültigen Zertifikat bedient wird. Die
inhaltliche Prüfung unten wurde daher über `www.vzugshop.ch` durchgeführt,
da die Original-URLs technisch nicht auslesbar waren.

## 1. Rechtschreibung, Tippfehler, Platzhalter

**Keine echten Tippfehler, keine Platzhaltertexte** (kein „TODO", „Lorem
ipsum", „XXX", „Platzhalter", „FIXME" o. ä.) auf den sechs Seiten gefunden
– gezielte grep-Suche über den Rohtext aller Seiten war negativ.

Die im Auftrag erwähnte Sorge um „19XX"-Datenlücken betrifft die
Zeitstrahl-Sektion auf `/ueber-uns/` – dort sind aktuell **alle Jahreszahlen
ausgefüllt** (1933, 1959, 1975, 1997, 2013, „Heute"), keine offenen
Platzhalter mehr sichtbar.

Ein vermeintlicher Fehler „Backäfen/Herde" tauchte nur in einer
WebFetch-Zusammenfassung auf (Transkriptionsfehler des Fetch-Modells);
im tatsächlichen HTML steht korrekt **„Backöfen/Herde"** – auf `/` und
`/geraeteanfrage/` identisch geschrieben, kein echter Fehler.

## 2. Leerzeichen vor/nach Links

Gezielte Prüfung des rohen HTML auf Text, der ohne Leerzeichen unmittelbar
an einen Link anschliesst (der bekannte Bug-Typ in diesem Projekt): **keine
Fundstellen.** Die einzigen Text-Link-Übergänge ohne Leerraum sind
schliessende Satzzeichen direkt nach einem Link (z. B. „…von Web3Forms
entgegengenommen" → `</a>.`, „…Datenschutzerklärung von Google` → `</a>.`),
was korrekte deutsche Interpunktion ist, kein Leerzeichen-Bug. Die
Pfeil-Icons ohne Leerzeichen („Mehr über uns erfahren→", „Rezepte
entdecken→", „Route in Google Maps öffnen→") sind ein bewusstes
Icon-Anschluss-Muster, kein Text-Klebefehler.

## 3. Terminologie- und Tonalitätskonsistenz zwischen Seiten

Durchgehend konsistent über alle sechs Seiten:

- Firmenname „Elektro Breitenmoser AG", Adresse „Fortunastrasse 2,
  CH-9437 Marbach", Telefon „071 777 12 76", WhatsApp
  „+41 76 425 20 50", E-Mail „info@vzugshop.ch", Instagram
  „@breitenmoserag_vzug" – Footer identisch auf allen Seiten.
- Schreibweise „V-ZUG" (Grossbuchstaben, Bindestrich) einheitlich.
- Schweizer Zahlenformat mit typografischem Apostroph („CHF 2’000",
  „5’000" usw.) im Budget-Dropdown konsistent verwendet.
- Copyright-Jahr „© 2026" korrekt (aktuelles Jahr).
- Anrede/Ton durchgehend per „Sie", freundlich-sachlich, ohne
  Stilbrüche zwischen den Seiten.

Ein kleiner, vermutlich bewusster Punkt zur Terminologie: Die Startseite
positioniert die Firma primär als „V-ZUG **Fachhändler**" (H1, Seitentitel
„V-ZUG Fachhändler Marbach"), während `/ueber-uns/` und der
Partner-Bereich auf der Startseite den Begriff „V-ZUG **Regionalpartner**"
in den Vordergrund stellen (Seitentitel „Über uns – V-ZUG
Regionalpartner"). Beide Begriffe sind sachlich korrekt und schliessen
sich nicht aus, aber die Doppelbezeichnung als primäre Identität variiert
je nach Seite – falls nicht bewusst so gewählt, lohnt sich ein Abgleich,
welcher Begriff als Haupt-Positionierung dienen soll.

## 4. Datenschutz-Seite: inhaltlich vollständig

`/datenschutz/` enthält alle erwarteten Abschnitte (Verantwortliche
Stelle, Datenbearbeitung/Formular/Google Maps/Logfiles, Cookies,
Aufbewahrungsdauer, Rechte, Datensicherheit, Änderungen, Kontakt),
korrekt mit „Stand: 1. September 2026" datiert, keine Lücken oder
Platzhalter. Verweise auf Web3Forms, Microsoft 365 und Google Maps als
Auftragsverarbeiter sind konkret benannt, nicht generisch/platzhalterhaft.

## Fazit

Inhaltlich ist die Website sauber, konsistent und launch-reif – keine
Tippfehler, keine Platzhalter, keine Leerzeichen-Klebefehler gefunden.
Der einzige harte Blocker ist technischer Natur: die Apex-Domain
`vzugshop.ch` (ohne www) ist wegen eines fremden, abgelaufenen
TLS-Zertifikats nicht sicher erreichbar und sollte vor dem eigentlichen
Go-Live per Redirect/Zertifikat auf `www.vzugshop.ch` korrigiert werden.
