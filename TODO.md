# ECHO-FALL — backlog

> **Statusy:** `[x]` oznacza zadanie wykonane i sprawdzone; `[ ]` oznacza zadanie otwarte lub oczekujące na test.

## Błędy

### [x] Pociski i efekty wizualne pozostają poza ekranem areny

- **Objaw:** na załączonym zrzucie z telefonu jasne ślady pocisków lub efektów przecinają górną krawędź pola gry i są widoczne przy jego brzegu. Zgłoszenie pochodzi z mobilnego widoku pliku HTML.
- **Oczekiwane:** pociski znikają po opuszczeniu areny, a wszystkie cząsteczki i smugi są przycinane do obszaru planszy.
- **Poprawka:** renderowanie areny jest przycinane do logicznego obszaru planszy; pociski i cząsteczki są usuwane po opuszczeniu jego granic.
- **Status:** poprawione i potwierdzone przez użytkownika w teście na telefonie.

### [x] Przycisk pełnego ekranu zachowuje spójny wygląd w języku polskim i angielskim

- **Objaw:** na zrzutach porównawczych przycisk „EXIT FULL SCREEN” ma ciemne tło i cienką ramkę, a „WYJDŹ Z PEŁNEGO EKRANU” jest jasnoszary, większy i inaczej sformatowany.
- **Oczekiwane:** przełączenie polskiego i angielskiego zmienia wyłącznie etykietę. Tło, obramowanie, krój pisma, rozmiar i odstępy przycisku pozostają takie same.
- **Poprawka:** przycisk pauzy ma własną, stałą klasę i układ; zmiana języka aktualizuje tylko tekst etykiety. Układ akcji dopasowuje się do małych ekranów.
- **Dowód:** załączone zrzuty 9481.jpg (angielski) i 9482.jpg (polski).
- **Status:** naprawione i sprawdzone przez użytkownika; polska etykieta zachowuje układ i styl przycisku.

### [x] Flagi języków wyświetlają się jako kody na komputerze

- **Objaw:** na zrzutach z komputera flagi przy językach Polski i Angielski wyświetlają się jako litery „PL” i „GB”.
- **Przyczyna:** selektor używał emoji flag, których wygląd zależy od fontów i obsługi emoji w systemie.
- **Poprawka w buildu 0.10.1:** emoji zastąpione osadzonymi flagami SVG; ich wygląd nie zależy od fontu emoji systemu.
- **Dowód:** zrzuty image-1791556959059.jpg i image-1791556969153.jpg.
- **Status:** poprawka gotowa i sprawdzona na komputerze.

### [x] Przekaźnik otrzymuje kilka obrażeń z jednego wachlarza pocisków

- **Odtworzenie potwierdzone:** piętro 2, pokój 2, trudność Standard; teleportujący przeciwnik (Beam Wraith) trafia przekaźnik trzema pociskami jednocześnie po teleportacji.
- **Oczekiwane:** przekaźnik powinien przyjmować wiele trafień zgodnie z paskiem integralności i pozwolić na obronę przez obie fale.
- **Wstępny trop:** Beam Wraith wystrzeliwuje po teleportacji wachlarz trzech pocisków; na piętrze 2 każdy zadaje 28 obrażeń.
- **Potwierdzone na zrzucie 9520.jpg:** pojawia się komunikat „Przekaźnik zniszczony” i ekran końca runu po wachlarzu trzech pocisków Beam Wraith.
- **Przyczyna:** pociski nie przekazywały właściciela do obsługi trafienia. Ograniczenie 720 ms działało przy kontakcie z wrogiem, ale wachlarz trzech pocisków (po 28 obrażeń na piętrze 2) omijał limit i sumował obrażenia.
- **Poprawka w buildu 0.9.7:** każdy pocisk przeciwnika zachowuje referencję do strzelca; limit obrażeń 720 ms jest wspólny dla jego pocisków i kontaktu.
- **Rozszerzenie w buildu 0.10.0:** HP przekaźnika skaluje się z mnożnikiem obrażeń piętra oraz o 8% za każdy kolejny pokój. Napis HP ochrony i komunikat „Przetrwaj” są dwukrotnie większe.
- **Status:** poprawka i skalowanie gotowe; potwierdzone

### [x] Powiadomienia rozwoju są wyświetlane poza areną

- **Objaw:** komunikaty, np. „LEVEL UP”, pojawiają się na środku areny i zasłaniają widok walki.
- **Oczekiwane:** powiadomienia są czytelne, ale wyświetlane poza obszarem gry.
- **Poprawka w buildu 0.10.0:** pasek komunikatów przeniesiony pod arenę, z zachowaniem tłumaczeń i czasu wyświetlania.
- **Status:** zatwierdzone

### Weryfikacja po poprawkach

- [x] Sprawdzić na telefonie, czy pociski, smugi, cząsteczki i rozbłyski nie wychodzą poza arenę.
- [x] Sprawdzić przycisk pełnego ekranu w pauzie po przełączeniu języka PL/EN.
- [x] Sprawdzić układ przycisku pełnego ekranu w orientacji poziomej.
- [x] Przejść menu, HUD, sklep, nagrody, walki z bossami i ekrany końcowe w Traditional Chinese; sprawdzić fonty, zawijanie tekstu i zapamiętanie języka po ponownym otwarciu.
- [x] Na komputerze sprawdzić flagi SVG w ustawieniach po przełączeniu PL/EN oraz wygląd przycisków klawiszy.

## Kolejne prace

### Test Build 0.12.1 — Endless i epilog

- [ ] Po bossie 3 sprawdzić obie opcje: zakończenie runu oraz kontynuację z zachowaniem broni i builda.
- [ ] Przejść piętra 4–6 (po dwa pokoje i boss na piętro); sprawdzić nowych wrogów, trzech bossów, skalowanie i leczenie między piętrami.
- [ ] Sprawdzić Laser: pierścień-emiter obraca się za graczem podczas namierzania i blokuje kierunek po ładowaniu; wiązka biegnie do krawędzi areny. Zweryfikować trafienie oraz limit 50% maksymalnego HP, także na Hard.
- [ ] Sprawdzić zwycięstwo epilogu, śmierć i restart oraz pojedynczy wpis historii runu.
- [ ] Przetestować klawiaturę i dotyk, układ telefonu oraz PL, EN i Traditional Chinese.
- [ ] Endless: rozegrać ponad 10 fal; sprawdzić licznik, brak bossów i pulę nowych wrogów po falach 5 i 10.
- [ ] Endless: sprawdzić wzrost HP i obrażeń wrogów o 3% na falę bez wzrostu prędkości; przy 10, 60 i 100 fali potwierdzić mnożniki ×1,27, ×2,77 i ×3,97.
- [ ] Endless: sprawdzić, że awans dodaje +2 maks. HP zamiast +5, a w trybach kampanii nadal +5.
- [ ] Endless: co 10 fal sprawdzić podwyżkę cen sklepu o 25% (fala 10: ×1,25; fala 60: ×2,5), bez zmiany wartości kupowanych przedmiotów.
- [ ] Endless: co 5 fal sprawdzić wybór Artefakt / Sklep / Ryzykowny pokój; po każdej opcji ma ruszyć następna fala, a liczba wrogów w ryzykownym pokoju ma również skalować się.
- [ ] Endless: sprawdzić śmierć, restart oraz najwyższą falę w podsumowaniu i historii runów.
- [x] Endless z Protokołem Okrążenia przetestowany do fali 46; trudny, ale możliwy do przeżycia. Poziom 319 i 1015 eliminacji.

### Priorytet 1 — kontrola wydania

- [x] Utworzyć publiczny GitHub Release v0.10.0 z listą zmian i linkiem do pliku HTML w repozytorium.
- [x] Przejść całą kampanię od menu do zwycięstwa w głównym buildu 0.11.6; osobno sprawdzić ekran śmierci oraz restart — użytkownik potwierdził wykonanie.
- [x] Sprawdzić klawiaturę, pauzę, ustawienia języka i dotykowy drążek na telefonie.
- [x] Sprawdzić pełny ekran na telefonie i komputerze, w tym wyjście przyciskiem przeglądarki oraz działanie przy otwarciu HTML w różnych aplikacjach.
- [x] Na komputerze sprawdzić zmianę klawiszy, konflikt przypisań, przywracanie domyślnych oraz zapis po ponownym otwarciu gry.
- [x] Sprawdzić przejścia pokoi, cele przetrwania i przekaźnika, bossów, nagrody oraz zmianę broni.
- [x] Sprawdzić zapis postępu i odblokowań po zamknięciu i ponownym otwarciu gry.

### Priorytet 2 — balans i czytelność

- [ ] Zebrać krótkie notatki z kilku runów na Normal i Hard: czas kampanii, zgony, nadmiar lub brak złomu, skuteczność broni i synergie. Użytkownik często o tym zapomina; użyj krótkiej ściągi po runie:
  - `Normal/Hard | wynik | piętro/pokój | czas | zgony | złom: mało/OK/dużo | broń/synergie | 1 obserwacja`
- [ ] Po zebraniu obserwacji poprawiać balans małymi zmianami i zapisywać każdą zmianę w osobnym commicie.
- [x] Sprawdzić skalowanie gry na telefonie; użytkownik potwierdził, że działa dobrze.
- [ ] Po testach użytkownika dopracować układ poziomy: na razie nie zgłoszono uwag; zebrać konkretne problemy, jeśli pojawią się później, i dopiero wtedy poprawić arenę, HUD lub sterowanie dotykowe.

### Pomysły na później

- [x] Dodać suwak głośności z zapisem ustawienia na urządzeniu; użytkownik potwierdził działanie.
- [x] !(Ważne) Regulacja rozmiaru (70–130%) i przezroczystości (35–100%) dotykowych elementów sterowania — wdrożona w głównym buildu 0.11.6; sprawdzona wcześniej przez użytkownika w Test Build 0.11.1.
- [x] !(Ważne) Dodać muzykę cyberpunkową: spokojny motyw menu i szybszy motyw walki — proceduralne utwory i przejścia między nimi sprawdzone przez użytkownika; ocena: „fajna”. Są w głównym buildu 0.11.6.
- [ ] Dodać osobny motyw muzyczny do walk z bossami — niski priorytet, na później.
- [x] Dodać podsumowanie runu dostępne opcjonalnie z ekranu zakończenia i w historii ostatnich 10 runów.
- [ ] !(Ważne) Eksport/import lokalnego zapisu do przenoszenia między przeglądarkami — wdrożono w głównym buildu 0.11.6; test odłożony na później:
  - [ ] Wyeksportować zapis, zaimportować go w innej przeglądarce i sprawdzić język, ustawienia, postęp oraz historię runów.
  - [ ] Sprawdzić anulowanie importu i potwierdzić, że dotychczasowy zapis pozostaje bez zmian.
  - [ ] Sprawdzić odrzucenie nieprawidłowego lub uszkodzonego pliku bez nadpisania zapisu.
- [ ] Rozważyć dodatkowe wyzwania lub warianty pokoi dopiero po sprawdzeniu balansu obecnej kampanii.
