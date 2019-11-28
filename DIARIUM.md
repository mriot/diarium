# Diarium

## Navigation
* Eintrag bearbeiten / Ansicht umschalten
* Eintrag speichern (+ auto speichern zwischendurch)
* Favoriten
* Suche
* Logout

## Content
* Mit Markdown formatieren
    * Markdown Editor und Preview
        * Split Ansicht ist anpassbar
* Kleine Toolbar als Header im Editor -> Formatvorlagen
    * __Medien hochladen / einbinden__
    * Bild einfügen
    * Link einfügen
    * Code Snippet einfügen
    * __Undo / Redo__
    * _Speichern_
* __Fullscreen Ansicht__
* Metadaten Editor
    * Kategorien / Labels
* __Ausgewählter Tag wird als Pfad in Adresszeile geschrieben__
    * z.B. /2019/11/22  <- 22. November 2019
* Kalender Navigation mit Pfeilen: "einen Tag vor/zurück"

## Sidebar
* Toggle Sidebar?!
* Kalender (TimeTracker style)
    * Mit Feiertagen
    * Tage mit Einträgen werden farblich hervorgehoben
    * _Evtl. Google Calendar Anbindung_
* Progress in % 
    * Monat und Jahr (wie viele Tage abgedeckt sind)
* Fetch actions anzeigen (wie beim TimeTracker)

---

## Datenbank
* Inhalt sollte gecrypted sein
* Felder
    * ID
    * Timestamp (z.B UTC)
        * Zu welchem Tag gehört der Eintrag?
    * Markup/Content type ("markdown", ...)
        * Falls wir evtl. mal auf was anderes umbauen wollen
    * _SFW/NSFW Flag_
        * NSFW -> ggf. PW geschützt
    * _Kategorien / Labels_
        * z.B. "bild, sfw, fun, ..."
    * 

---

## Verhalten
* INIT AUFRUF
    * App aufrufen
    * Einloggen
    * Aktueller Tag wird geladen bzw. angezeigt
    * Falls aktueller Tag schon vorhanden, Lesemodus standardmäßig öffnen
    * Edit mode via “Bearbeiten” Button starten
    * Ansonsten direkt im Edit mode starten
    