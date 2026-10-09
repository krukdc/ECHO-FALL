# ECHO-FALL — backlog

## Błędy

### [x] Pociski i efekty wizualne pozostają poza ekranem areny

- **Objaw:** na załączonym zrzucie z telefonu jasne ślady pocisków lub efektów przecinają górną krawędź pola gry i są widoczne przy jego brzegu. Zgłoszenie pochodzi z mobilnego widoku pliku HTML.
- **Oczekiwane:** pociski znikają po opuszczeniu areny, a wszystkie cząsteczki i smugi są przycinane do obszaru planszy.
- **Poprawka:** renderowanie areny jest przycinane do logicznego obszaru planszy; pociski i cząsteczki są usuwane po opuszczeniu jego granic.
- **Status:** poprawione w kodzie; sprawdzenie na telefonie i w przeglądarce pozostaje do wykonania.

### [x] Przycisk pełnego ekranu zmienia wygląd zależnie od języka

- **Objaw:** na zrzutach porównawczych przycisk „EXIT FULL SCREEN” ma ciemne tło i cienką ramkę, a „WYJDŹ Z PEŁNEGO EKRANU” jest jasnoszary, większy i inaczej sformatowany.
- **Oczekiwane:** przełączenie polskiego i angielskiego zmienia wyłącznie etykietę. Tło, obramowanie, krój pisma, rozmiar i odstępy przycisku pozostają takie same.
- **Poprawka:** przycisk pauzy ma własną, stałą klasę i układ; zmiana języka aktualizuje tylko tekst etykiety. Układ akcji dopasowuje się do małych ekranów.
- **Dowód:** załączone zrzuty 9481.jpg (angielski) i 9482.jpg (polski).
- **Status:** poprawione w kodzie; porównanie wizualne obu języków pozostaje do wykonania.

### Weryfikacja po poprawkach

- [ ] Sprawdzić na telefonie, czy pociski, smugi, cząsteczki i rozbłyski nie wychodzą poza arenę.
- [ ] Porównać przycisk pełnego ekranu w pauzie po przełączeniu języka PL/EN, także w orientacji poziomej.

## Kolejne prace

### Priorytet 1 — kontrola wydania

- [ ] Przejść całą kampanię od menu do zwycięstwa i osobno sprawdzić ekran śmierci oraz restart.
- [ ] Sprawdzić klawiaturę, pauzę, ustawienia języka i dotykowy drążek na telefonie.
- [ ] Sprawdzić pełny ekran na telefonie i komputerze, w tym wyjście przyciskiem przeglądarki oraz działanie przy otwarciu HTML w różnych aplikacjach.
- [ ] Sprawdzić przejścia pokoi, cele przetrwania i przekaźnika, bossów, nagrody oraz zmianę broni.
- [ ] Sprawdzić zapis postępu i odblokowań po zamknięciu i ponownym otwarciu gry.

### Priorytet 2 — balans i czytelność

- [ ] Zebrać krótkie notatki z kilku runów na Normal i Hard: czas kampanii, zgony, nadmiar lub brak złomu, skuteczność broni i synergie.
- [ ] Po zebraniu obserwacji poprawiać balans małymi zmianami i zapisywać każdą zmianę w osobnym commicie.
- [ ] Sprawdzić czytelność HUD-u i przycisków na małych ekranach, także w orientacji poziomej. (Układ poziomy dodany; kontrola na prawdziwym telefonie nadal potrzebna.)
- [ ] Po testach użytkownika dopracować układ poziomy: zebrać konkretne uwagi i poprawić rozmiar areny, rozmieszczenie HUD-u oraz wygodę sterowania dotykowego.

### Pomysły na później

- [ ] Dodać podsumowanie runu ze statystykami: czas, pokój śmierci/zwycięstwa, zabici wrogowie, otrzymane obrażenia i wybrane bonusy.
- [ ] Dodać opcję eksportu i importu lokalnego zapisu, aby można go było przenieść między przeglądarkami.
- [ ] Rozważyć dodatkowe wyzwania lub warianty pokoi dopiero po sprawdzeniu balansu obecnej kampanii.
