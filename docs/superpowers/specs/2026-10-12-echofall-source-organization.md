# ECHO//FALL — uporządkowane źródła gry

**Status:** projekt do przeglądu użytkownika; implementacja jeszcze się nie rozpoczęła.

## Cel

Przygotować osobną, łatwą do przejrzenia kopię deweloperską bieżącego Test Buildu. Kod źródłowy ma być podzielony na pliki HTML, CSS i logiczne sekcje JavaScript, a funkcje mają mieć krótkie polskie opisy w komentarzach `// #(opis)`. Zbudowana gra nadal ma działać jako pojedynczy plik HTML, offline i bez zewnętrznych bibliotek.

## Stan bazowy

- Punktem wyjścia jest `Echo Test Build 0.10.3.html`.
- Test Build ma około 188 KB, pojedynczy blok CSS, jeden blok JavaScript i około 100 nazwanych funkcji.
- Repozytorium publikuje samodzielne pliki HTML; zwykły Test Build i istniejący plik wydania nie mogą zostać zmienione w ramach tej pracy.
- Użytkownik chce najpierw obejrzeć uporządkowaną wersję w osobnym folderze.

## Proponowana struktura

```text
dev/echo-fall-source/
  README.md
  src/
    index.template.html
    styles.css
    js/
      00-bootstrap.js
      10-game-core.js
      20-combat-and-enemies.js
      30-progression-and-rooms.js
      40-ui-and-localization.js
      50-settings-and-persistence.js
      90-startup.js
  tools/
    build.mjs
  dist/
    Echo Test Build 0.10.3.html
```

Nazwy i podział sekcji są robocze; przed implementacją dopasować ich granice do rzeczywistej kolejności zależności w skrypcie.

## Budowanie

- Lokalny skrypt Node.js korzysta wyłącznie z modułów wbudowanych w Node; bez instalowania paczek.
- `index.template.html` zawiera jednoznaczne miejsca wstawienia CSS i JavaScriptu.
- Skrypt czyta sekcje JavaScript w jawnej kolejności i łączy je w jeden klasyczny blok `<script>`. Nie ładuje osobnych modułów przeglądarkowych, ponieważ gra musi nadal otwierać się z `file://`.
- CSS i JavaScript są osadzane w wygenerowanym HTML-u. `dist/` pozostaje samodzielnym plikiem do otwarcia i testowania.
- Build kończy się czytelnym błędem, jeśli brakuje pliku źródłowego, placeholdera albo sekcji z manifestu.

## Komentarze funkcji

- Każda nazwana deklaracja funkcji w źródłowym JavaScripcie otrzyma bezpośrednio nad sobą komentarz `// #(krótki opis po polsku)`.
- Opisy mają mówić, za co funkcja odpowiada, bez streszczania każdej instrukcji.
- Istotne funkcje strzałkowe będą opisane, jeśli ich cel nie wynika jasno z nazwy lub miejsca użycia. Nie dodawać komentarzy do prostych callbacków wyłącznie po to, by powielać ich kod.
- Komentarze pozostają w plikach źródłowych; builder może je zachować w wynikowym pliku dla łatwiejszego debugowania.

## Zakres i ograniczenia

- Praca tworzy wyłącznie `dev/echo-fall-source/` oraz może dodać krótki odnośnik w README do instrukcji uruchamiania deweloperskiego.
- Nie zmieniać obecnego Test Buildu, wydania, balansu, zapisów, tłumaczeń ani logiki rozgrywki.
- Nie dodawać frameworka, bundlera zewnętrznego, serwera, zależności CDN ani zasobów online.
- Pierwsza wersja ma być kopią bieżącego Test Buildu, a nie nową funkcjonalną gałęzią gry.

## Kryteria akceptacji

1. Źródła znajdują się wyłącznie w osobnym folderze deweloperskim.
2. HTML, CSS i JavaScript są rozdzielone; logika gry jest pocięta na sekcje bez zmiany kolejności wykonania.
3. Wszystkie nazwane funkcje mają zrozumiałe polskie komentarze `// #(opis)`.
4. Jedno lokalne polecenie buduje pojedynczy HTML bez instalowania zależności.
5. Wygenerowany HTML zawiera osadzony CSS i JavaScript i działa offline po otwarciu jako plik.
6. Wynik i źródła zachowują funkcje Test Buildu 0.10.3; istniejące pliki gry pozostają nietknięte.
7. Składnia wygenerowanego JavaScriptu przechodzi kontrolę statyczną; użytkownik może później sprawdzić zachowanie gry.

## Otwarte kwestie do przeglądu

- Czy podział sekcji JavaScript jest wystarczająco czytelny, czy użytkownik wolałby jeden komentowany plik JS zamiast kilku fragmentów składanych przez builder?
- Czy po obejrzeniu osobnej kopii użytkownik chce, aby późniejsze zmiany były rozwijane w źródłach i budowane do Test Buildu, czy nadal bezpośrednio w pojedynczym pliku HTML?
