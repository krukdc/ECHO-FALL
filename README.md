# ECHO-FALL

**Język / Language / 語言:** [Polski](README.md) · [English](README.en.md) · [繁體中文](README.zh-TW.md)

ECHO-FALL to samodzielna, działająca offline gra akcji w jednym pliku HTML. Aktualny główny build gry: `ECHO-FALL.build.0.11.6.html`.

## Jak uruchomić grę

1. Pobierz aktualny plik HTML ze strony [najnowszego wydania](https://github.com/krukdc/ECHO-FALL/releases/latest) i otwórz go w aktualnej przeglądarce, np. Chrome, Edge lub Firefox.
2. Rozpocznij run z ekranu startowego. Instalacja, serwer i internet nie są potrzebne.
3. Na telefonie otwórz plik w przeglądarce. Gra wykrywa ekran dotykowy i pokazuje sterowanie na ekranie. Możesz obrócić telefon do poziomu; układ gry dopasuje się do orientacji.

Postęp, odblokowania i ustawienie języka są zapisywane lokalnie w przeglądarce (`localStorage`). Wyczyszczenie danych przeglądarki może usunąć ten zapis.

## Sterowanie

| Czynność | Klawiatura | Ekran dotykowy |
| --- | --- | --- |
| Ruch | WASD lub strzałki (konfigurowalne) | Drążek ekranowy |
| Celowanie | IJKL (konfigurowalne) | Automatyczne podczas ataku |
| Zwykły atak | Z (konfigurowalne) | A / FIRE |
| Nova | X (konfigurowalne) | B / NOVA |
| Blink | Spacja (konfigurowalne) | L / BLINK |
| Statystyki postaci | C | SELECT |
| Pauza | Escape | START |


Język polski, angielski lub tradycyjny chiński (繁體中文) oraz klawisze sterowania na komputerze można zmienić w ustawieniach na ekranie startowym lub w pauzie. Przypisania i wybór języka zapisują się lokalnie w przeglądarce. Strzałki nadal działają jako alternatywne sterowanie ruchem. Przycisk ⛶ w nagłówku lub menu pauzy przełącza tryb pełnoekranowy.

## Pliki projektu

- `ECHO-FALL.build.0.11.6.html` — aktualna gra wraz z HTML, CSS i JavaScriptem.
- `Older Versions/` — archiwum wcześniejszych wydań gry.
- `docs/superpowers/specs/` — zatwierdzone opisy projektu.
- `docs/superpowers/plans/` — plany implementacji i kampanii.
- `TODO.md` — znane błędy i lista pomysłów na rozwój.
- `dev/echo-fall-source/` — uporządkowane źródła lokalnego Test Buildu 0.12.0.

## Źródła deweloperskie (opcjonalnie)

Do grania wystarczy pobrać jeden plik HTML z wydania. Źródła i budowanie są potrzebne tylko przy pracach nad grą. Zainstaluj Node.js, a następnie uruchom w folderze repozytorium:

```powershell
node dev/echo-fall-source/tools/build.mjs
node --test dev/echo-fall-source/tests/*.test.mjs
```

Pierwsze polecenie tworzy lokalny plik `dev/echo-fall-source/dist/Echo Test Build 0.12.0.html`. Nie jest on wysyłany do repozytorium.

## Zgłaszanie błędów

W zakładce **Issues** wybierz formularz **Zgłoś błąd**. Podaj wersję gry, urządzenie, przeglądarkę, orientację ekranu i kroki prowadzące do problemu. Repozytorium jest publiczne, więc zgłoszenia i komentarze są widoczne dla wszystkich.

## Podstawy Git

Uruchom te polecenia w folderze projektu:

```powershell
git status
git log --oneline
git add README.md README.en.md README.zh-TW.md TODO.md
git commit -m "Krótki opis zmiany"
```

Zapisuj każdą większą, samodzielną zmianę osobnym commitem. Przed zapisem możesz podejrzeć zmiany poleceniem `git diff`.
