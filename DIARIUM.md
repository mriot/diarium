# Diarium

## Navigation

* Bearbeiten Modus für ausgewählten Tag umschalten
* Meta Daten Editor
* Favoriten
* Suche
* Logout

---

## Editor / Preview

* Mit Markdown formatieren
  * Markdown Editor und Preview
    * Split Ansicht ist anpassbar

### Toolbar (im Editor)

* Undo / Redo
* Medien (Bilder, etc) hochladen / einbinden
* Link einfügen
* Code Snippet einfügen
* Scroll Synchonisierung (Editor -> Preview)
* Zen-Mode
* Split Ansicht togglen
* Fullscreen
* Editor Layout reset

### Metadaten Editor

* Kategorien / Labels

---

## Sidebar

* Kalender
* Progress in % (wie viele Tage abgedeckt sind)
  * Woche, Monat und Jahr
* "Toast notifications" (?)

### Kalender

* Farblich hervorgehobene Tage
  * Tage mit Einträgen (grüne "Box")
  * Feiertage (F)
  * Urlaubstage (U)
  * Krankheitstage (K)
* Kalender Navigation mit Pfeilen: "einen Tag vor/zurück"
* Ausgewählter Tag wird als Pfad in Adresszeile geschrieben
  * z.B. /2019/11/22  <- 22. November 2019

---

## Datenbank

* Inhalt sollte irgendwie geschützt sein
  * Gecrypted (?)
* Felder
  * ID
  * Timestamp (z.B UTC)
    * Zu welchem Tag gehört der Eintrag?
  * Markup/Content type ("markdown", ...)
    * Falls wir evtl. mal auf was anderes umbauen wollen
  * SFW/NSFW Flag
    * NSFW -> Inhalt geblurt und muss freigeschaltet werden (?)
  * Kategorien / Labels
    * z.B. "bild, sfw, fun, ..."
