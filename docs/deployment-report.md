# Deployment-Check – Elektro Breitenmoser AG Website

**Geprüft:** `package.json`, `astro.config.mjs`, `.github/workflows/deploy.yml`, `public/.htaccess`, lokaler `npm run build`.

## Ergebnis

- **Build reproduzierbar:** `npm run build` läuft lokal fehlerfrei durch (5 Seiten, keine Fehler/Warnungen). Die letzten 5 GitHub-Actions-Läufe auf `main` sind alle grün.
- **Node-Version konsistent:** `package.json` verlangt `>=22.12.0`, der Workflow installiert Node 22 (aktuellste 22.x-Version via `actions/setup-node`) — kompatibel. `.nvmrc` (`22.12.0`) neu ergänzt, damit lokale Entwicklung dieselbe Version wie CI nutzt (`nvm use`).
- **Workflow-Robustheit:** `npm ci` (statt `npm install`) sorgt für reproduzierbare Installs aus der Lockfile; `force_orphan: true` beim Deploy in den `dist`-Branch verhindert unnötiges Anwachsen der Historie eines rein generierten Branches — sinnvoll konfiguriert, keine Änderung nötig.
- **Keine Secrets im Workflow:** Nur das automatische `secrets.GITHUB_TOKEN` mit Standardrechten wird verwendet.
- **`.htaccess`:** wird von Astro unverändert nach `dist/` kopiert und landet damit im Document Root, das Plesk ausliefert.

## Offene manuelle Schritte (durch den Nutzer)

1. **Plesk/Hosttime Git-Integration** auf den Branch `dist` einrichten (bzw. bestehende Verbindung von `vzug.saxer.sg` auf die finale Domain umstellen).
2. **Domain bestätigen:** `astro.config.mjs` setzt aktuell `https://www.elektrobreitenmoser.ch` als Annahme (siehe TODO-Kommentar dort) — vor Launch mit der tatsächlichen Domain abgleichen, da dieser Wert Canonical-Tags, JSON-LD und `sitemap.xml` steuert.
3. **Formspree-/Web3Forms-Endpoint** in `src/pages/geraeteanfrage.astro` eintragen (aktuell Platzhalter) und Testeinsendung prüfen.
4. **`.htaccess`-Wirkung nach Deployment verifizieren:** `curl -I https://<domain>` prüfen, da Plesk `AllowOverride` teils einschränkt — Security-Header ggf. zusätzlich im Plesk-Panel selbst setzen.
5. **Datenschutzerklärung und Über-uns-Zeitstrahl** mit echten Inhalten befüllen (aktuell TODO-Platzhalter, siehe `ANFORDERUNGEN.md`).
