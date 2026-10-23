# ECHO//FALL — źródła głównej gry 0.12.5

Te uporządkowane źródła budują główną grę ECHO-FALL 0.12.5 jako pojedynczy plik HTML działający offline. Nie zawierają DEBUGGING ROOM ani kodu odblokowującego Debug.

## Budowanie gry

Wymagany jest Node.js. Polecenie uruchom z katalogu głównego repozytorium:

```powershell
node dev/echo-fall-main-source/tools/build.mjs
```

Skrypt zapisze `ECHO-FALL.build.0.12.5.html` w katalogu głównym. Do grania wystarczy ten plik; Node.js jest potrzebny tylko do budowania.

## Układ źródeł

- `src/index.template.html` — szablon strony.
- `src/styles.css` — wygląd gry.
- `src/js/` — uporządkowane sekcje logiki, walki, AI, menu, ustawień, lokalizacji, epilogu i Endless.
- `src/locales/pl.json`, `en.json`, `zh-TW.json` — komplet tłumaczeń; 639 kluczy w każdym języku.
- `src/locales/source-aliases.json` — dokładne dopasowanie starszych napisów i zapisanych nazw do kluczy.
- `tools/build.mjs` — łączy źródła w plik produkcyjny.
- `tools/locales.mjs` — sprawdza klucze i parametry tłumaczeń oraz osadza słowniki w HTML.
- `tests/` — testy walki, ekranów językowych i restartu.

Opis edycji tłumaczeń: [TRANSLATIONS.md](TRANSLATIONS.md). Po zmianie źródeł uruchom budowanie ponownie. Nie edytuj ręcznie wygenerowanego HTML, jeżeli zmiany mają przetrwać kolejne budowanie.

Test Build 0.12.1 z funkcjami Debug pozostaje lokalną kopią testową i nie jest częścią publikowanego repozytorium.
