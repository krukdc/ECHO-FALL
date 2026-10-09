# ECHO-FALL: skalowanie i powtarzalność runów

Data: 2026-10-09  
Status: projekt do przeglądu użytkownika  
Zakres: `ECHO-FALL.build.0.9.4.html`

## Cel i ograniczenia

Rozbudować balans i powtarzalność ECHO-FALL bez zmiany jego podstawowej formy: kampanii offline w jednym pliku HTML, trzech pięter po sześć pokoi, wyboru broni po bossie, sterowania klawiaturą i dotykowego drążka oraz interfejsu po polsku i angielsku.

Zmiany będą wdrażane w czterech etapach. W każdym etapie nowe wartości, komunikaty i stany interfejsu muszą działać w obu językach. Dane runu i odblokowania pozostają lokalne.

## Etap 1: balans premii i sklepu

- Premia szybkostrzelności pozostaje nagrodą wyłącznie za ukończenie ryzykownego pokoju. Pojedynczy przyznany bonus nadal losuje się z zakresu 10–25%.
- Efektywna premia szybkostrzelności ma limit +75% względem bazowego odstępu broni. Za każde pełne 5 punktów procentowych nagrody, których nie można zastosować z powodu limitu, gracz dostaje 1 dodatkowy złom. Ekran nagrody pokazuje zastosowaną premię i ewentualny złom.
- Złom z ryzykownego pokoju i wybór artefaktu pozostają zachowane.
- Sklep zachowuje obecny wzrost wartości i cen o 5% na każdy kolejny pokój danego piętra. Przegląd obejmie zaokrąglenia i praktyczną wartość ofert przy późniejszych pokojach. Premii szybkostrzelności nie będzie można kupić.
- Statystyki pokazują bieżącą efektywną premię i limit. Bonus resetuje się na początku nowego runu i utrzymuje między piętrami tego samego runu.

## Etap 2: nowe rodzaje pokoi

- Kampania zachowuje trzy piętra, sześć pokoi na piętro i bossa w pokoju szóstym.
- W pokojach 1–5 pojawią się dwa dodatkowe warianty celu: przetrwanie 45 sekund oraz obrona przekaźnika przed falami wrogów. Pozostałe pokoje używają obecnego trybu eliminacji dwóch fal.
- Harmonogram typów jest stały i rotuje między piętrami: piętro 1 — przetrwanie w pokoju 2 i przekaźnik w pokoju 4; piętro 2 — przekaźnik w pokoju 2 i przetrwanie w pokoju 4; piętro 3 — przetrwanie w pokoju 3 i przekaźnik w pokoju 5.
- Przekaźnik zaczyna ze 100 HP. Wrogowie poruszają się i celują w przekaźnik; trafienia bezpośrednie i ataki kontaktowe odejmują mu obrażenia zgodne z atakiem danego wroga. HUD pokazuje jego HP. Jeśli HP spadnie do zera, run kończy się porażką.
- Wariant przetrwania pokazuje pozostały czas. Po upływie czasu pokój jest ukończony, nawet jeśli przeciwnicy pozostają przy życiu.
- Ryzykowna trasa działa jako modyfikator zaplanowanego pokoju: dodaje 3 elitarnych wrogów, a w trybie Hard 6; istniejący cel pokoju nadal obowiązuje. Po pełnym ukończeniu celu gracz otrzymuje dodatkowy złom, premię szybkostrzelności oraz darmowy artefakt.

## Etap 3: synergie artefaktów

Synergie odblokowują się automatycznie po posiadaniu obu wskazanych artefaktów. Efekt działa przez resztę runu; wielokrotne zdobywanie składników nie zwielokrotnia efektu synergii.

- **Sanguine Circuit + Echo Chamber:** Nova, która trafi wroga, leczy 20 HP raz na użycie zamiast 12 HP.
- **Afterimage + Phase Lattice:** Blink tworzy falę uderzeniową o promieniu 72 jednostek wokół miejsca lądowania, zadającą obrażenia równe dwukrotności bazowych obrażeń aktualnej broni.
- **Rail Conductor + Deep Reservoir:** Nova Rail Drivera zadaje o 25% większe obrażenia.

Aktywne synergie będą widoczne w panelu statystyk. Ich opisy będą dostępne po polsku i angielsku.

## Etap 4: wyzwania po kampanii

- Po pierwszym zwycięstwie gracz odblokuje opcjonalne dyrektywy dostępne przy wyborze runu:
- **Szał łowcy:** każda fala ma o 50% więcej wrogów (zaokrąglając w górę), a co czwarty nowo pojawiający się wróg jest elitarny.
- **Szklany rdzeń:** maksymalne HP gracza wynosi 50% wartości startowej po uwzględnieniu wybranego poziomu trudności, a obrażenia gracza wzrastają o 25% po zastosowaniu modyfikatora trudności.
- **Niedobór:** złom zdobywany za eliminacje i nagrody z pokoi jest zmniejszony o 50%; ceny sklepu pozostają bez zmian.
- Każda dyrektywa pokaże dokładne modyfikatory przed rozpoczęciem runu.
- Najlepszy wynik kampanii dla każdej dyrektywy zapisuje się lokalnie i oddzielnie od zwykłych runów; rekord uwzględnia wybraną broń i wynik.
- Ukończenie kampanii osobno z każdą z trzech dyrektyw odblokuje złoty wariant palety rdzenia gracza, bez wpływu na statystyki.
- Zapis w `localStorage` zachowuje obecne odblokowane bronie i rekordy; nowe pola dyrektyw, rekordów i kosmetyki są dopisywane z wartościami domyślnymi bez kasowania istniejącego zapisu.

## Przepływ i zachowanie

Nowe typy pokoi korzystają z istniejącego wyboru trasy, przepływu nagród i przejścia między pokojami. Przegrana nadal kończy run i pokazuje ekran śmierci; zwycięstwo nadal pokazuje ekran finałowy. Nowy run czyści wyłącznie dane runu, a zachowuje trwałe odblokowania, rekordy oraz ustawienia języka.

Komunikaty o celu, postępie, premiach i odblokowaniach muszą być czytelne na małym ekranie. Sterowanie mobilne pozostaje dostępne podczas walki i nie może zasłaniać wskaźników celu.

## Granice projektu

- Nie dodajemy nowych pięter ani nie wydłużamy kampanii.
- Nie dodajemy zakupów szybkostrzelności.
- Nie dodajemy zewnętrznych bibliotek, usług ani zasobów sieciowych.
- Nie zmieniamy podstawowego sterowania, istniejących broni ani zasad trybu Hard poza zmianami koniecznymi do prezentacji nowych wariantów pokoi i dyrektyw.

## Kryteria akceptacji

1. Szybkostrzelność nigdy nie przekracza limitu, a każda nadwyżka nagrody z ryzykownego pokoju jest jasno rozliczona jako złom.
2. Sklep pokazuje zgodne, proporcjonalnie rosnące ceny i wartości, bez źródeł premii szybkostrzelności.
3. Każde piętro oferuje pokój przetrwania i pokój obrony, a cele, postęp i nagrody poprawnie prowadzą do następnego pokoju.
4. Synergie uruchamiają się tylko po zdobyciu obu składników, nie dublują się i zgadzają się z opisem w statystykach.
5. Dyrektywy odblokowują się po zwycięstwie, stosują jawne modyfikatory, zapisują osobne rekordy i mogą odblokować wyłącznie kosmetyczną nagrodę.
6. Cała kampania pozostaje grywalna klawiaturą i dotykiem, a dodane elementy interfejsu działają po polsku i angielsku.
