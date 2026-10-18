# Główna gra 0.12.0 — projekt integracji Test Buildu bez Debug

## Cel

Zaktualizować główną, samodzielną grę ECHO-FALL z 0.11.6 do 0.12.0, przenosząc do niej wszystkie ukończone funkcje z lokalnego Test Buildu 0.12.1. Nowa wersja ma zachować pojedynczy plik HTML do uruchamiania offline. Test Build pozostaje dostępny lokalnie wraz ze swoimi funkcjami testowymi.

## Zakres funkcji

Główna gra otrzymuje zawartość kampanii i poprawki zawarte w Test Buildzie, w szczególności epilog po trzecim bossie, dodatkowych wrogów i bossów, tryb Endless, historię i podsumowanie runów, import/eksport zapisu, ustawienia QoL, muzykę, ustawienia mobilnego sterowania oraz dotychczasowe poprawki i lokalizacje PL/EN/繁體中文.

Główna gra nie może zawierać wyzwania DEBUGGING ROOM, kodu `Debug`, jego lokalnego odblokowania, interfejsu wyboru przeciwników/bossów ani ścieżek wyniku i zapisu specyficznych dla debugowania. Kody ECHO-ALL i ECHO-NULL oraz zwykłe ustawienia pozostają.

## Architektura źródeł i budowania

- Zachować istniejące źródła Test Buildu w `dev/echo-fall-source/` bez zmian funkcjonalnych.
- Utworzyć `dev/echo-fall-main-source/` jako uporządkowane źródła głównej gry, pochodzące z tej samej bazy 0.12.1.
- Wariant główny ma własny skrypt budujący, który jawnie składa wyłącznie fragmenty produkcyjne i zapisuje samodzielny plik `ECHO-FALL.build.0.12.0.html` w katalogu głównym repozytorium.
- Fragment Debug nie jest kopiowany do wariantu głównego. Z fragmentów współdzielonych usuwa się wyłącznie zależności wymagane przez Debug, zachowując pozostałe zachowanie Test Buildu.
- Źródła pozostają podzielone na sekcje, a wynik produkcyjny nadal działa jako jeden offline HTML bez zewnętrznych zależności.

## Integracja z repozytorium

- Ustawić wersję głównego buildu i wskazania bieżącego wydania w README w językach PL, EN i 繁體中文.
- Dodać krótką instrukcję budowania wariantu głównego; instrukcja Test Buildu nadal wskazuje jego własny wynik.
- Zachować istniejące pliki Test Buildu, lokalne źródła, archiwum wrogów i wszystkie niezwiązane zmiany użytkownika.
- Nie przenosić Test Buildu do głównego pliku ani nie publikować zmian na GitHubie w ramach tej integracji.

## Kryteria ukończenia

1. `ECHO-FALL.build.0.12.0.html` jest aktualnym, samodzielnym plikiem głównej gry.
2. Główna gra zawiera wszystkie ukończone funkcje Test Buildu wymienione w zakresie.
3. W źródłach i gotowym pliku głównej gry nie ma Debug unlocku, DEBUGGING ROOM ani jego mechanik i ścieżek wykonania.
4. Test Build nadal zachowuje DEBUGGING ROOM i buduje się z własnych źródeł.
5. Główne instrukcje i README PL/EN/繁體中文 wskazują wersję 0.12.0 oraz prawidłowe polecenia budowania.

## Walidacja

Budowa obu wariantów potwierdzi, że każdy ma poprawny, samodzielny wynik. Statyczny przegląd wariantu głównego sprawdzi brak symboli i tekstów związanych z Debug, a porównanie źródeł potwierdzi zachowanie Debug wyłącznie w Test Buildzie. Rozgrywka końcowa wymaga ręcznego sprawdzenia w przeglądarce.

## Poza zakresem

- Zmiana projektu mechanik lub balansu funkcji Test Buildu.
- Usunięcie lokalnego Test Buildu albo jego funkcji debugowych.
- Commit/push wydania lub utworzenie GitHub Release.
