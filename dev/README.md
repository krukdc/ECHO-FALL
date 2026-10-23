# Źródła ECHO//FALL — główna gra 0.12.5 / Test Build 0.12.1

- `echo-fall-main-source/` — główna gra, bez areny Debug.
- `echo-fall-source/` — Test Build z areną Debug.
- `echo-fall-main-source.zip` — paczka aktualnych źródeł głównej gry.
- `echo-fall-source.zip` — paczka aktualnych źródeł Test Buildu i wynikowego HTML 0.12.1.

Oba warianty zawierają poprawki oraz tłumaczenia PL, EN i tradycyjny chiński.
Źródła są punktem wyjścia do dalszych zmian. ZIP jest kopią z chwili pakowania;
nie aktualizuje się automatycznie po edycji plików.

Z katalogu głównego repozytorium:

```powershell
node dev/echo-fall-main-source/tools/build.mjs
node dev/echo-fall-source/tools/build.mjs
```

Pierwsze polecenie zapisuje główny HTML w katalogu repozytorium. Drugie zapisuje
Test Build w `echo-fall-source/dist/`. Do grania wystarczy odpowiedni HTML.
Publikacja na GitHubie jest osobną czynnością; te paczki przygotowano lokalnie.
