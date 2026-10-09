# ECHO-FALL — backlog

## Błędy

### [x] Pociski i efekty wizualne pozostają poza ekranem areny

- **Objaw:** na załączonym zrzucie z telefonu jasne ślady pocisków lub efektów przecinają górną krawędź pola gry i są widoczne przy jego brzegu. Zgłoszenie pochodzi z mobilnego widoku pliku HTML.
- **Oczekiwane:** pociski znikają po opuszczeniu areny, a wszystkie cząsteczki i smugi są przycinane do obszaru planszy.
- **Poprawka:** renderowanie areny jest przycinane do logicznego obszaru planszy; pociski i cząsteczki są usuwane po opuszczeniu jego granic.
- **Status:** poprawione i potwierdzone przez użytkownika w teście na telefonie.

### [ ] Przycisk pełnego ekranu nadal łamie układ zależnie od języka

- **Objaw:** na zrzutach porównawczych przycisk „EXIT FULL SCREEN” ma ciemne tło i cienką ramkę, a „WYJDŹ Z PEŁNEGO EKRANU” jest jasnoszary, większy i inaczej sformatowany.
- **Oczekiwane:** przełączenie polskiego i angielskiego zmienia wyłącznie etykietę. Tło, obramowanie, krój pisma, rozmiar i odstępy przycisku pozostają takie same.
- **Poprawka:** przycisk pauzy ma własną, stałą klasę i układ; zmiana języka aktualizuje tylko tekst etykiety. Układ akcji dopasowuje się do małych ekranów.
- **Dowód:** załączone zrzuty 9481.jpg (angielski) i 9482.jpg (polski).
- **Status:** nadal występuje. Zrzut 9518.jpg pokazuje, że polska etykieta w pauzie zawija się do bardzo wąskiej kolumny; poprawka z poprzedniego buildu nie rozwiązała problemu na telefonie.

### [ ] Przekaźnik otrzymuje kilka obrażeń z jednego wachlarza pocisków

- **Odtworzenie potwierdzone:** piętro 2, pokój 2, trudność Standard; teleportujący przeciwnik (Beam Wraith) trafia przekaźnik trzema pociskami jednocześnie po teleportacji.
- **Oczekiwane:** przekaźnik powinien przyjmować wiele trafień zgodnie z paskiem integralności i pozwolić na obronę przez obie fale.
- **Wstępny trop:** Beam Wraith wystrzeliwuje po teleportacji wachlarz trzech pocisków; na piętrze 2 każdy zadaje 28 obrażeń.
- **Potwierdzone na zrzucie 9520.jpg:** pojawia się komunikat „Przekaźnik zniszczony” i ekran końca runu po wachlarzu trzech pocisków Beam Wraith.
- **Przyczyna:** pociski nie przekazywały właściciela do obsługi trafienia. Ograniczenie 720 ms działało przy kontakcie z wrogiem, ale wachlarz trzech pocisków (po 28 obrażeń na piętrze 2) omijał limit i sumował obrażenia.
- **Poprawka w buildu 0.9.7:** każdy pocisk przeciwnika zachowuje referencję do strzelca; limit obrażeń 720 ms jest wspólny dla jego pocisków i kontaktu. Potwierdzić na telefonie, że jeden wachlarz nie niszczy od razu przekaźnika.

### [ ] Powiadomienia rozwoju zasłaniają arenę

- **Objaw:** komunikaty, np. „LEVEL UP”, pojawiają się na środku areny i zasłaniają widok walki.
- **Oczekiwane:** powiadomienia są czytelne, ale wyświetlane poza obszarem gry.
- **Poprawka w buildu 0.9.7:** pasek komunikatów przeniesiony pod arenę, z zachowaniem tłumaczeń i czasu wyświetlania.
- **Status:** zmiana czeka na test użytkownika.

### Weryfikacja po poprawkach

- [ ] Sprawdzić na telefonie, czy pociski, smugi, cząsteczki i rozbłyski nie wychodzą poza arenę.
- [ ] Porównać przycisk pełnego ekranu w pauzie po przełączeniu języka PL/EN, także w orientacji poziomej.
- [ ] Przejść menu, HUD, sklep, nagrody, walki z bossami i ekrany końcowe w Traditional Chinese; sprawdzić fonty, zawijanie tekstu i zapamiętanie języka po ponownym otwarciu.

## Kolejne prace

### Priorytet 1 — kontrola wydania

- [ ] Po testach buildu 0.9.7 utworzyć prywatny GitHub Release z plikiem HTML i krótką listą zmian.
- [ ] Przejść całą kampanię od menu do zwycięstwa i osobno sprawdzić ekran śmierci oraz restart.
- [ ] Sprawdzić klawiaturę, pauzę, ustawienia języka i dotykowy drążek na telefonie.
- [ ] Sprawdzić pełny ekran na telefonie i komputerze, w tym wyjście przyciskiem przeglądarki oraz działanie przy otwarciu HTML w różnych aplikacjach.
- [ ] Na komputerze sprawdzić zmianę klawiszy, konflikt przypisań, przywracanie domyślnych oraz zapis po ponownym otwarciu gry.
- [ ] Sprawdzić przejścia pokoi, cele przetrwania i przekaźnika, bossów, nagrody oraz zmianę broni.
- [ ] Sprawdzić zapis postępu i odblokowań po zamknięciu i ponownym otwarciu gry.

### Priorytet 2 — balans i czytelność

- [ ] Zebrać krótkie notatki z kilku runów na Normal i Hard: czas kampanii, zgony, nadmiar lub brak złomu, skuteczność broni i synergie.
- [ ] Po zebraniu obserwacji poprawiać balans małymi zmianami i zapisywać każdą zmianę w osobnym commicie.
- [x] Sprawdzić skalowanie gry na telefonie. Użytkownik potwierdził, że działa dobrze; układ przycisku pełnego ekranu pozostaje osobnym błędem.
- [ ] Po testach użytkownika dopracować układ poziomy: zebrać konkretne uwagi i poprawić rozmiar areny, rozmieszczenie HUD-u oraz wygodę sterowania dotykowego.

### Pomysły na później

- [ ] Dodać podsumowanie runu ze statystykami: czas, pokój śmierci/zwycięstwa, zabici wrogowie, otrzymane obrażenia i wybrane bonusy.
- [ ] Dodać opcję eksportu i importu lokalnego zapisu, aby można go było przenieść między przeglądarkami.
- [ ] Rozważyć dodatkowe wyzwania lub warianty pokoi dopiero po sprawdzeniu balansu obecnej kampanii.
