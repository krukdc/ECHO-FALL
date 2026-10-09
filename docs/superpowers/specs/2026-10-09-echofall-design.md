# ECHO//FALL — projekt gry

## Cel i zakres

Stworzyć samodzielną, dopracowaną grę action-RPG uruchamianą lokalnie w nowoczesnej przeglądarce z jednego pliku HTML. Gra ma prowadzić gracza przez kompletną pętlę: menu, walkę, rozwój postaci, finał, śmierć lub zwycięstwo i restart. Całość musi być obsługiwana klawiaturą; mysz nie jest wymagana.

## Doświadczenie gracza

Gracz wciela się w Echo, wojownika uwięzionego w neonowych ruinach. W widoku z góry przebija się przez trzy piętra po sześć pokoi każde, wybierając uzbrojenie i trudność przed biegiem oraz trasę pomiędzy pokojami. Każde piętro kończy własny boss; pokonanie go otwiera drogę na kolejne piętro, a kampanię kończy boss trzeciego piętra. Krótkie, czytelne komunikaty, mocne efekty uderzeń i wyraźne sygnały ataków mają sprawić, że zręcznościowa walka pozostaje zrozumiała mimo efektownej oprawy.

## Przebieg

1. Ekran tytułowy pokazuje nazwę, sterowanie i opcję rozpoczęcia.
2. Każde piętro ma sześć pokoi: pięć pokoi walki, każdy z dwiema falami, i szósty pokój z bossem. Arena zamyka się podczas walki i otwiera po jej wyczyszczeniu.
3. Po pokojach walki gracz wybiera trasę: jedno z trzech losowanych ulepszeń, czarny rynek z zakupami za złom albo ryzykowną elitarną arenę z premią i darmowym artefaktem. Ostatni pokój piętra jest zarezerwowany dla bossa.
4. Piętro I zachowuje Wardenа i dotychczasowy zestaw wrogów. Jego pokonanie nie kończy biegu: otwiera windę na piętro II. Przejście zachowuje broń i ulepszenia, przywraca Aegis do maksimum i leczy 30% maksymalnego HP.
5. Na piętrze II pojawiają się dwa nowe typy wrogów i boss Cartographer, który atakuje wzorami laserowych pasów oraz węzłami osłony. HP i obrażenia wszystkich wrogów tego piętra, w tym bossa, wynoszą 2× wartości odpowiadających im bazowych przeciwników z piętra I (+100%).
6. Na piętrze III pojawiają się dwa kolejne typy wrogów; typy z poprzedniego piętra mogą również wracać. Końcowy boss Null King walczy przez przyzywanie klonów i zmianę bezpiecznych stref areny, co odróżnia go od Wardenа i Cartographera. HP wrogów, w tym bossa, wynosi 2,5×, a obrażenia 2,25× wartości bazowych z piętra I.
7. Tryb Hard nakłada się na skalowanie pięter: zwiększa HP wrogów o 50%, podwaja ich liczbę i ogranicza HP gracza o połowę oraz jego obrażenia o 20%. Pokonanie bossa piętra III pokazuje ekran zwycięstwa.
8. Zdrowie równe zero pokazuje ekran śmierci ze statystykami biegu i opcją ponownego podejścia.
9. Menu startowe pozwala wybrać jedną z trzech broni o odmiennym ataku i umiejętności specjalnej; Rift Scatter odblokowuje pierwsze zwycięstwo.
10. Wyniki, najlepszy wynik, liczba biegów, łączna liczba eliminacji i odblokowanie broni są zapisywane lokalnie w przeglądarce.
11. Pauza zatrzymuje symulację i pozwala wrócić do gry albo do menu. Restart tworzy świeży bieg bez pozostałości stanu poprzedniego.

## Sterowanie

- WASD lub strzałki: poruszanie się.
- IJKL: celowanie w czterech kierunkach; ostatni kierunek ruchu jest domyślnym celem.
- Z: szybki atak dystansowy.
- X: umiejętność specjalna, zużywa energię i ma czas odnowienia.
- Spacja: unik z krótką nietykalnością.
- Enter: zatwierdzanie opcji, wybór ulepszenia i rozpoczęcie biegu.
- Strzałki lewo/prawo: zmiana zaznaczenia w menu, pauzie i kartach ulepszeń.
- Esc: pauza, a z menu pauzy powrót do gry.
- R: restart na ekranie śmierci lub zwycięstwa.
- M: wyciszenie lub włączenie efektów dźwiękowych.

Wszystkie akcje muszą być możliwe wyłącznie klawiaturą, z widocznym zaznaczeniem wybranej opcji menu i ulepszenia. Obsługa klawiszy zależy od aktualnego ekranu, aby nawigacja menu nie uruchamiała ruchu postaci. Powtarzające się zdarzenia keydown nie mogą niekontrolowanie powielać ataków ani zatwierdzeń.

## Walka i postęp

Gracz ma zdrowie, energię, poziom i licznik eliminacji. Atak podstawowy wystrzeliwuje pocisk w kierunku celu. Umiejętność specjalna uwalnia falę energii wokół gracza; energia odnawia się przez walkę. Unik przemieszcza gracza i zapewnia krótki okres nietykalności. Przeciwnicy obejmują słabego napastnika walczącego wręcz, strzelca z dystansu i ciężkiego wroga z wolnym, zapowiadanym szarżowaniem. Ataki wroga mają telegraphy, aby gracz mógł zareagować. Boss łączy wybrane zachowania w dwóch lub więcej fazach.

Wartości obrażeń, prędkości, czasów odnowienia, liczebności fal i zdrowia wroga są strojonymi stałymi, skupionymi w jednym miejscu kodu. Wartości na piętrach II i III są mnożnikami względem odpowiadających przeciwników piętra I; tryb Hard nakłada swoje mnożniki osobno. Każdy boss ma odrębny wygląd, zestaw ataków i czytelne sygnały ostrzegawcze. Wybór ulepszenia natychmiast pokazuje jego efekt i nie wymaga odświeżenia strony.

## Obsługa telefonu

Na wąskim ekranie interfejs układa się pionowo, zachowuje czytelny HUD i uwzględnia bezpieczne marginesy urządzeń z wycięciami. Podczas gry lewy wirtualny drążek steruje ruchem. Przytrzymanie przycisku ataku strzela seriami i automatycznie celuje w najbliższego przeciwnika. Osobne przyciski uruchamiają Novę, unik i pauzę. Menu oraz karty ulepszeń można zatwierdzać dotknięciem. Układ dostosowuje kontrolki do pionowej i poziomej orientacji. Sterowanie klawiaturą pozostaje dostępne.

## Interfejs i oprawa

Canvas w widoku z góry zajmuje główną część ekranu i skaluje się do dostępnego okna z zachowaniem proporcji. Interfejs zawiera numer piętra, numer pokoju z sześciu, falę, paski zdrowia i energii, poziom, eliminacje oraz krótkie komunikaty o postępie. Menu, pauza, wybór ulepszenia, przejście windą, śmierć i zwycięstwo są czytelnymi warstwami nad planszą. Styl to ciemne tło, turkusowe i magentowe światła, proste geometryczne postacie, cząsteczki, smugi pocisków i krótkie błyski trafień. Efekty są rysowane programowo bez zewnętrznych zasobów. Efekty dźwiękowe są generowane przez Web Audio i mogą zostać wyciszone.

## Architektura i ograniczenia

Projekt nie wymaga frameworka, serwera, instalacji ani pobierania zasobów. Główny artefakt to `index.html` z osadzonym CSS i JavaScriptem. Kod dzieli się logicznie na: stan i przejścia ekranów, obsługę klawiatury, pętlę czasu i renderowania, model gracza i przeciwników, system kolizji/pocisków, generowanie fal i bossa, wybór ulepszeń, HUD i efekty dźwiękowe.

Symulacja używa delta czasu ograniczonego do bezpiecznego maksimum i `requestAnimationFrame`; zmiana rozmiaru okna aktualizuje płótno bez zmiany stanu gry. Po ukryciu karty gra przechodzi w pauzę lub nie symuluje ukrytego czasu. Restart resetuje wszystkie encje, timery, statystyki, ulepszenia i stany klawiszy.

## Kryteria odbioru

- Plik HTML otwiera się lokalnie i pokazuje menu startowe bez błędów ani zależności zewnętrznych.
- Gracz może przejść cały bieg, sterując wyłącznie klawiaturą.
- Każde z trzech pięter ma pięć pokoi walki i szósty pokój bossa; po dwóch pierwszych bossach bieg przechodzi windą dalej.
- Piętra II i III wprowadzają odpowiednio dwa nowe typy wrogów oraz odrębnego bossa, a ich skalowanie odpowiada uzgodnionym mnożnikom.
- Ulepszenia mają odczuwalny efekt, a dopiero boss piętra III kończy kampanię ekranem zwycięstwa.
- Śmierć i zwycięstwo oferują działający restart, który rozpoczyna czysty bieg.
- Pauza rzeczywiście zatrzymuje logikę gry; zmiana rozmiaru ekranu nie psuje sterowania ani renderowania.
- Interfejs jasno komunikuje zdrowie, energię, postęp piętra, fazę bossa i dostępność akcji.
- Wąski ekran telefonu udostępnia pełną pętlę gry przez dotyk, także start, wybór ulepszeń, pauzę i restart.
- Przytrzymany atak dotykowy automatycznie celuje w najbliższego żywego wroga; puszczenie ataku zatrzymuje strzelanie.
