# ECHO-FALL

ECHO-FALL to samodzielna, działająca offline gra akcji w jednym pliku HTML. Aktualna wersja gry: `ECHO-FALL.build.0.10.0.html`.

## Jak uruchomić grę

1. Otwórz plik `ECHO-FALL.build.0.10.0.html` w aktualnej przeglądarce, np. Chrome, Edge lub Firefox.
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

- `ECHO-FALL.build.0.10.0.html` — gra wraz z HTML, CSS i JavaScriptem.
- `docs/superpowers/specs/` — zatwierdzone opisy projektu.
- `docs/superpowers/plans/` — plany implementacji i kampanii.
- `TODO.md` — znane błędy i lista pomysłów na rozwój.

## Zgłaszanie błędów

W zakładce **Issues** wybierz formularz **Zgłoś błąd**. Podaj wersję gry, urządzenie, przeglądarkę, orientację ekranu i kroki prowadzące do problemu. Repozytorium jest prywatne, więc zgłoszenia zobaczą tylko osoby z dostępem do projektu.

## Podstawy Git

Uruchom te polecenia w folderze projektu:

```powershell
git status
git log --oneline
git add ECHO-FALL.build.0.10.0.html TODO.md README.md
git commit -m "Krótki opis zmiany"
```

Zapisuj każdą większą, samodzielną zmianę osobnym commitem. Przed zapisem możesz podejrzeć zmiany poleceniem `git diff`.
