# Tłumaczenia ECHO//FALL

## Gdzie edytować

Główna gra: `dev/echo-fall-main-source/src/locales/`.
Test Build: `dev/echo-fall-source/src/locales/`.

Każdy wariant ma własne pliki `pl.json`, `en.json` i `zh-TW.json`.
Są to słowniki w formacie „jeden język, wiele kluczy”. Przykład:

```json
{
  "menu.start": "Rozpocznij grę",
  "run.wave": "Fala {wave}"
}
```

Zmieniaj wartości po prawej stronie. Klucze, np. `menu.start`, pozostają
identyczne we wszystkich językach. `zh-TW` oznacza tradycyjny chiński dla Tajwanu;
gra zachowuje istniejące ustawienie `zh-Hant`, więc zapisany wybór języka działa nadal.

## Jak korzysta z tego kod

- `t('menu.start')` odczytuje napis w aktualnym języku.
- `t('run.wave', {wave: 12})` uzupełnia numer fali.
- `translationGroup('settings.audio')` pobiera zestaw etykiet ustawień dźwięku.
- `data-i18n="menu.start"` na elemencie tłumaczy jego tekst bez zmiany klas i ikon.
- `data-i18n-ready` oznacza treść już przetłumaczoną kluczami i chroni ją przed
  starszym mechanizmem podmiany słów. Taki ekran należy ponownie wyrenderować
  po zmianie języka — ustawienia robią to w `setLanguage`.

Nowe tłumaczenia powinny być zwykłym tekstem. Ikony, znaczniki HTML i klasy CSS
pozostają w kodzie interfejsu. Przy przypisywaniu tekstu do DOM preferuj `textContent`.
Gdy etykieta jest składana w HTML, musi zostać odpowiednio escapowana.

## Budowanie

Uruchom dotychczasowy `tools/build.mjs` odpowiedniego wariantu gry.
Skrypt automatycznie włącza słowniki do wynikowego HTML — gracz nadal potrzebuje
tylko jednego pliku, bez serwera i pobierania JSON przez sieć.

Budowanie zatrzymuje się, jeśli brakuje klucza, pojawi się dodatkowy klucz tylko
w jednym języku lub parametry `{...}` różnią się między językami. W czasie gry
brakujący wpis korzysta z angielskiego, a nieznany klucz wyświetla swoją nazwę.

## Stan migracji

Przegląd objął wszystkie moduły gry oraz szablon HTML i napisy w CSS.
Główna gra ma 639 kluczy, Test Build 688 (dodatkowe teksty areny Debug).
Każdy klucz ma wersję PL, EN i tradycyjną chińską.

Przeniesiono menu, ustawienia, HUD, statystyki, bronie, artefakty, sklep,
wyzwania, historię runów, komunikaty walki, bossów, epilog i Endless.
Nazwy klawiszy, kody dostępu oraz nazwa ECHO//FALL pozostają niezmienne.

Nie ma już podmiany fragmentów słów. Plik source-aliases.json mapuje dokładne
stare napisy na klucze, m.in. dla historycznych nazw zapisanych przed migracją.
Nie zmieniamy identyfikatorów przedmiotów ani formatu zapisów gracza.
Stare słowniki legacy nie są częścią gry.

Sprawdzenia: budowanie z kontrolą kluczy i parametrów, przegląd ekranów
w PL/EN/zh-Hant w Edge oraz testy restartu na PC i emulowanym dotyku.
Test na fizycznym telefonie i korekta językowa przez użytkowników pozostają
do wykonania. Główna gra: build 0.12.5. Test Build pozostaje lokalną wersją 0.12.1.
