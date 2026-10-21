# 24 Fragen zur KI – Adventskalender 2026

Ein Adventskalender für GitHub Pages mit 24 Fragen und Antworten als umdrehbare Karten. Hinter jedem Türchen steht ein Begriff aus der Künstlichen Intelligenz. Das nächste Türchen wird jeweils ab seinem Datum **nach deutscher Zeit** veröffentlicht; bereits geöffnete Türchen bleiben verfügbar.

## Schnellstart mit GitHub Pages

1. Auf GitHub ein **neues öffentliches Repository** erstellen, beispielsweise `ki-adventskalender`. Standardbranch: `main`.
2. **Nur die Dateien und Ordner aus `github-upload`** ins Stammverzeichnis dieses Repositorys übertragen. Insbesondere `.github/workflows/pages.yml` muss enthalten sein. **Nicht** die lokale `VORSCHAU.html` oder die private Schlüsseldatei hochladen!
3. Unter **Settings → Secrets and variables → Actions → New repository secret** einen Secret mit Namen `ADVENT_KEY` anlegen. Als Wert den vollständigen Schlüssel aus der getrennten Datei `VERTRAULICH_SCHLUESSEL.txt` verwenden. Nicht in eine normale Datei oder ein öffentliches GitHub-Issue kopieren.
4. Unter **Settings → Pages → Build and deployment → Source** `GitHub Actions` auswählen.
5. Unter **Actions** den Workflow `Adventskalender automatisch veröffentlichen` bei Bedarf einmal manuell über **Run workflow** starten (nachdem der Secret angelegt ist). Falls der Workflow schon beim ersten Hochladen ohne Secret gestartet und fehlgeschlagen ist, einfach erneut ausführen.
6. Die Website liegt anschließend in der Regel unter `https://DEIN-NAME.github.io/ki-adventskalender/`. Die genaue Adresse steht unter **Settings → Pages**.

**Wichtig:** Der Browser bekommt nur Karten, die GitHub bei der Veröffentlichung tatsächlich freigegeben hat. Die übrigen Antworten sind im öffentlichen Repository nur verschlüsselt enthalten. Ein Vorstellen der Computeruhr schaltet sie nicht frei.

### GitHub schon vor Dezember ausprobieren

Du kannst das Projekt sofort hochladen und den Workflow unter **Actions** starten.
Wenn er erfolgreich durchläuft, erscheint bereits die Kalenderseite – **bis zum 30. November sind dort aber bewusst alle 24 Türchen gesperrt**. Die private `VORSCHAU.html` bleibt die einzige Ansicht, in der alle Karten schon vorher offen sind.

Am besten testest du also zwei Dinge getrennt: (1) GitHub-Seite und Workflow werden erfolgreich veröffentlicht und (2) alle Inhalte funktionieren in der privaten Vorschau. **Bitte keine Vorschau und keine entschlüsselten Testdateien ins öffentliche Repository hochladen**, um alle Türchen zu testen.

## Redaktionsvorschau

Die Datei `VORSCHAU.html` liegt **außerhalb** des Ordners `github-upload`. Sie lässt sich durch Doppelklick direkt im Browser öffnen. Dort sind alle 24 Karten bereits freigeschaltet; Fragen und Antworten können vorab überprüft werden. Die Datei niemals auf GitHub Pages veröffentlichen.

## Zeitplan und Hinweise

- Erstes Türchen: **1. Dezember 2026**. Letztes Türchen: **24. Dezember 2026**.
- Veröffentlichung über GitHub Actions ca. **00:23 Uhr MEZ** (zusätzliche Kontrollläufe später am Tag).
- GitHub kann geplante Workflows **verzögern** oder unter bestimmten Bedingungen deaktivieren, etwa wenn in einem öffentlichen Repository 60 Tage lang keine Aktivitäten stattfinden. Daher die Actions-Läufe im Dezember kontrollieren; gegebenenfalls den Workflow manuell starten. Wenn du das Repository bereits im Oktober anlegst, empfehle ich eine kleine README-Aktualisierung im November, damit es nicht noch während des Advents wegen 60 Tagen Inaktivität deaktiviert wird. Es gibt **keine sekundengenaue Garantie**.
- Der Workflow wird nur auf dem **Standardbranch** nach Zeitplan ausgeführt.
- In der 2026-Version bleiben die Karten ab Freigabe auch in späteren Monaten öffentlich zugänglich.
- Die Karten können in der privaten Datei `KARTEN-INHALTE-PRIVAT.json` bearbeitet werden. Mit `INHALTE_AKTUALISIEREN.py` lassen sich daraus die verschlüsselte Datei und die Vorschau neu erzeugen. (Python mit `cryptography` erforderlich.) Ein Austausch des GitHub-Secrets allein ersetzt keine Inhalte. Auch die Verweise auf externe Materialien sind in der privaten Kartendatei enthalten. Das Framing-Experiment ist im Programmcode hinterlegt.
- Keine Cookies, Tracker oder externen JavaScript-Bibliotheken. Die Seite speichert auch den Besuch einzelner Türchen nicht dauerhaft.

## Prüfung der automatischen Veröffentlichung

Die folgende Prüfung funktioniert auf dem eigenen Rechner, wenn der `ADVENT_KEY` als Umgebungsvariable gesetzt und Python mit dem Paket `cryptography` installiert ist:

```bash
python build.py
```

Der Ordner `site` enthält dann genau die Karten, deren Veröffentlichungsdatum nach deutscher Zeit bereits erreicht ist. Er wird **nicht** ins öffentliche Repository übernommen. Die GitHub Action führt denselben Vorgang bei der Veröffentlichung aus.

## Herkunft, Lizenz und Nutzung

Idee, Anforderungen und didaktische Konzeption: **Jutta Aeckersberg**. Die **Textentwürfe und der Programmcode sind KI-generiert mit ChatGPT**. Die fachliche und didaktische Prüfung sowie die redaktionelle Bearbeitung erfolgen vor der Veröffentlichung durch Jutta Aeckersberg. Die Links führen zu eigenständigen externen Angeboten mit jeweils eigenen Nutzungsbedingungen.

- **Pädagogische Inhalte:** [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.de) – Namensnennung, keine kommerzielle Nutzung, Weitergabe von Bearbeitungen unter gleichen Bedingungen.
- **Programmcode:** [MIT-Lizenz](https://opensource.org/license/mit) – siehe `LICENSE-CODE.txt`. Der Herkunftshinweis beansprucht kein exklusives Urheberrecht an rein KI-generierten Bestandteilen; Rechte Dritter bleiben unberührt.

Die Website benötigt außer GitHub Pages keine Datenbank und keinen Anwendungsserver.
