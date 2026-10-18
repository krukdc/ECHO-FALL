# ECHO//FALL — opcjonalny epilog po trzecim bossie

Data: 2026-10-18  
Status: projekt zatwierdzony w rozmowie; dokument czeka na przegląd użytkownika  
Punkt wyjścia: główny build 0.11.6

## Cel

Po pokonaniu obecnego trzeciego bossa gracz wybiera, czy kończy run zwykłym zwycięstwem kampanii, czy kontynuuje ten sam run w stałym, opcjonalnym epilogu. Epilog dodaje trzy nowe starcia z bossami oraz sześć nowych typów zwykłych wrogów. Ma zwiększać presję dzięki nowym wzorcom ataków i stopniowemu skalowaniu, zachowując czytelne sygnały i dostępne kontry.

## Zatwierdzone decyzje

- Główna kampania pozostaje pełna i kończy się zwycięstwem po obecnym bossie 3, jeśli gracz wybierze zakończenie.
- Kontynuacja jest stałym epilogiem z trzema sektorami; nie jest trybem endless.
- Każdy sektor epilogu ma 3 pokoje: dwa pokoje używające obecnej pętli walki, celów, tras i nagród, a następnie pokój bossa.
- Epilog zawiera sześć nowych typów zwykłych wrogów (po dwa na sektor) i trzech nowych bossów.
- Po trzecim nowym bossie następuje finał kampanii; nie dodajemy czwartego bossa epilogu.
- Zachowujemy aktualny jednoplikowy format HTML, pracę offline, sterowanie klawiaturą i ekranem dotykowym oraz interfejs PL, EN i Traditional Chinese.

## Przepływ kampanii

1. Po pokonaniu obecnego bossa 3 gra zatrzymuje run i pokazuje dwa duże wybory: **Zakończ run** oraz **Kontynuuj**.
2. **Zakończ run** uruchamia obecne zwycięstwo kampanii, aktualizuje odblokowania i zapisuje zwykły wynik zwycięstwa.
3. **Kontynuuj** zachowuje broń, ulepszenia, złom, wynik, statystyki runu, poziom trudności i dyrektywę, po czym rozpoczyna epilog.
4. Epilog mapuje się na piętra 4–6 i pokoje 1–3. Pokoje 1–2 każdego sektora korzystają z istniejących celów, tras, sklepu i ryzykownych pokoi; pokój 3 uruchamia przypisanego nowego bossa.
5. Po bossach epilogu 1 i 2 gra przechodzi przez istniejący ekran windy, czyści pociski i stan pokoju, przywraca pełny Aegis i leczy 30% maksymalnego HP.
6. Wejście z bossa 3 głównej kampanii do epilogu używa tej samej regeneracji co przejście windą.
7. Po pokonaniu trzeciego nowego bossa gra pokazuje zwycięstwo **Epilog ukończony**.
8. Śmierć w epilogu korzysta z obecnego ekranu porażki. Restart rozpoczyna nowy run i zeruje stan epilogu.

Run jest zapisywany w historii dopiero po faktycznym zwycięstwie albo porażce. Wybór kontynuacji nie tworzy dodatkowego wpisu ani zwycięstwa pośredniego.

## Pokoje i nowi wrogowie

Każdy zestaw dwóch nowych przeciwników pojawia się w odpowiednim sektorze oraz może powracać w kolejnych sektorach, z zachowaniem ich pierwotnego profilu i skalowania.

### Sektor 4 — Bramy

- **Bulwark:** osłania się od przodu; jego tarcza wyraźnie pokazuje chroniony kierunek. Gracz obchodzi go ruchem lub używa Blink, by zaatakować z boku albo z tyłu.
- **Siphon:** podłącza widoczny promień do gracza i wysysa Aegis. Przerwanie linii widzenia zrywa połączenie; wróg ma czas odnowienia przed kolejnym podłączeniem.
- **Boss — Gatewright:** przestawia bariery i bramy, zmieniając drogi przez arenę. Ataki zapowiada przed zamknięciem przejść. Generatory barier można zniszczyć; arena zawsze zachowuje co najmniej jedną bezpieczną drogę.

### Sektor 5 — Odbicia

- **Gate Gunner:** stawia parę oznaczonych portali i strzela pociskami, które wychodzą z drugiego portalu. Kierunek wylotu jest widoczny przed strzałem.
- **Echo Trapper:** oznacza aktualną pozycję gracza i po opóźnieniu uderza w zaznaczony punkt. Zmiana pozycji przed uderzeniem jest podstawową kontrą.
- **Boss — Auditor:** zapamiętuje kilka wcześniejszych pozycji gracza, a następnie sekwencyjnie ostrzeliwuje te miejsca po czytelnym odliczaniu. Przesuwanie się między znacznikami i Blink pozwalają uniknąć ataku.

### Sektor 6 — Przeciążenie

- **Laser:** przez około 1,4 s śledzi bieżącą pozycję gracza; następnie blokuje cel na jego ostatniej pozycji i ładuje strzał przez około 1 s. Linia promienia i miejsce trafienia pozostają widoczne przed wystrzałem. Gracz unika go, schodząc z linii lub używając Blink. Jeden wystrzał może zadać najwyżej 50% maksymalnego HP gracza; limit obowiązuje po wszystkich mnożnikach trudności i piętra. Jedno wystrzelenie powoduje najwyżej jedno trafienie, a równocześnie ładować może się najwyżej jeden Laser w pokoju.
- **Ricochet:** wysyła pociski odbijające się od krawędzi areny; każdy pocisk ma widoczny tor, ograniczoną liczbę odbić i znika po jej wykorzystaniu.
- **Boss — Archive Heart:** finałowy boss z trzema fazami. Kolejne fazy łączą wcześniej poznane sygnały i zagrożenia, ale żadna kombinacja nie może tworzyć nieuniknionego trafienia. Przejścia faz, bezpieczne strefy i okna ataku są wyraźnie zapowiadane.

Nazwy wrogów, bossów i sektorów są robocze i mogą zostać poprawione podczas przeglądu tekstu.

## Skalowanie i ekonomia

- Statystyki epilogu liczymy od wartości piętra III, bez ponownego mnożenia już zastosowanego skalowania piętra III.
- Sektor 4: HP wrogów i bossów ×1,15; ich obrażenia ×1,10.
- Sektor 5: HP ×1,30; obrażenia ×1,20.
- Sektor 6: HP ×1,45; obrażenia ×1,30.
- Te przyrosty nie zwiększają zwykłej szybkości ruchu wrogów. Specjalne ruchy i ataki bossów pozostają częścią ich wzorca, a nie mnożnikiem szybkości.
- Trudność Hard i wybrane dyrektywy nadal się stosują. Reguły dyrektyw, w tym brak złomu w Siege Protocol, pozostają aktywne.
- Ograniczenie obrażeń Lasera do 50% maksymalnego HP ma pierwszeństwo przed wszystkimi mnożnikami.
- Epilog korzysta z obecnych sklepów, tras, ryzyka, synergii i nagród. Nie dodaje nowej waluty ani osobnego systemu meta-progresji.

## Interfejs, historia i zgodność zapisu

- Wybór zakończenia ma osobne, zwięzłe tłumaczenia PL, EN i Traditional Chinese. Oba przyciski działają z klawiatury oraz dotyku i pozostają czytelne na wąskim ekranie.
- HUD pokazuje piętra 4–6 i pokoje epilogu, a ekran zwycięstwa rozróżnia zwykłe zwycięstwo od ukończenia epilogu.
- Historia runów zapisuje końcowy rezultat tylko raz oraz rozróżnia `campaignClear` i `epilogueClear`; porażka w epilogu pozostaje porażką.
- Wczytanie istniejącego zapisu nie wymaga nowych obowiązkowych pól. Nowe dane historii mają być opcjonalne i bezpiecznie domyślnie obsłużone przy starszych wpisach.
- Stan bossa, pociski, pułapki, route selection, held input i blokady wejścia muszą być czyszczone lub inicjalizowane przy każdym przejściu.
- Obsługa przejść musi być jednokrotna: wielokrotne trafienie martwego bossa, szybki tap lub wielokrotne Enter nie mogą pominąć sektora ani utworzyć kilku wpisów historii.

## Kryteria akceptacji

1. Boss 3 głównej kampanii pokazuje wybór zakończenia; oba wybory prowadzą do właściwej, rozłącznej ścieżki.
2. Wyjście z kampanii zapisuje zwykłe zwycięstwo; kontynuacja zachowuje bieżący build i nie zapisuje jeszcze runu.
3. Trzy sektory epilogu mają po dwa pokoje obecnej pętli i jednego przypisanego bossa; ukończenie daje 27 pokoi maksymalnie w runie.
4. Każdy z sześciu nowych wrogów ma czytelny atak, kontrę i działające skalowanie. Nowe typy nie zmieniają szybkości zwykłych wrogów jako ubocznego efektu skalowania.
5. Laser namierza, blokuje ostatnią pozycję i strzela po zapowiedzi; każde trafienie jest pojedyncze i ograniczone do 50% maksymalnego HP po wszystkich mnożnikach.
6. Bossowie Gatewright, Auditor i Archive Heart są mechanicznie różni od Warden, Cartographer i Null King; ataki mają czytelne sygnały i bezpieczną odpowiedź.
7. Healing przy wejściu do epilogu oraz po bossach 1–2 jest przyznawany dokładnie raz; brak przejściowego leczenia po bossie 3 epilogu.
8. Zwycięstwo, ukończenie epilogu, śmierć, historia i restart zachowują się poprawnie i tworzą najwyżej jeden wpis końcowy na run.
9. Zmiany nie psują istniejących zapisów, odblokowań, normalnych zwycięstw, ścieżki Hard ani dyrektyw.
10. Wybór, ekrany i komunikaty działają po polsku, angielsku i w Traditional Chinese na telefonie oraz komputerze.
11. Gotowy build pozostaje pojedynczym plikiem HTML działającym offline; przejście pełnego runu, śmierć/restart, obu gałęzi boss 3 i wszystkich bossów epilogu wymaga testu w przeglądarce.

## Poza zakresem

- Tryb endless lub powtarzanie epilogu po Archive Heart.
- Czwarty boss epilogu po Archive Heart.
- Nowa waluta, nowy sklep albo nowy trwały system ulepszeń między runami.
- Zmiany balansu głównej kampanii poza poprawkami koniecznymi do zachowania sprawiedliwych przejść i kompatybilności.
