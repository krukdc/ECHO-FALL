# ECHO//FALL — źródła głównej gry 0.12.0

Te uporządkowane źródła budują główną grę ECHO-FALL 0.12.0 jako pojedynczy plik HTML działający offline. Nie zawierają DEBUGGING ROOM ani kodu odblokowującego Debug.

## Budowanie gry

Wymagany jest Node.js. Polecenie uruchom z katalogu głównego repozytorium:

```powershell
node dev/echo-fall-main-source/tools/build.mjs
```

Skrypt zapisze `ECHO-FALL.build.0.12.0.html` w katalogu głównym. Do grania wystarczy ten plik; Node.js jest potrzebny tylko do budowania.

## Układ źródeł

- `src/index.template.html` — szablon strony.
- `src/styles.css` — wygląd gry.
- `src/js/` — uporządkowane sekcje logiki, walki, AI, menu, ustawień, lokalizacji, epilogu i Endless.
- `tools/build.mjs` — łączy źródła w plik produkcyjny.

Test Build 0.12.1 z funkcjami Debug pozostaje lokalną kopią testową i nie jest częścią publikowanego repozytorium.
