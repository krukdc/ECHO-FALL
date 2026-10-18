# Archiwum przeciwników — ECHO//FALL

Archiwum opisuje 13 zwykłych typów przeciwników i 6 bossów w Test Build 0.12.1. Nazwy w nawiasach to identyfikatory używane w kodzie.

## Jak czytać statystyki

Statystyki zwykłych wrogów to wartości bazowe dla Standardu na pierwszym piętrze: **HP**, **szybkość**, **obrażenia kontaktowe lub bazowe**, **XP** za pokonanie oraz **promień**. Szybkość jest podana w jednostkach areny na sekundę. Bossowie mają bazowe HP, promień, prędkość ruchu i bazowe obrażenia; obrażenia ich ataków są podane osobno.

- Na piętrze 2 zwykli wrogowie otrzymują ×2 HP i obrażenia.
- Na piętrach 3–6 zwykli wrogowie otrzymują ×2,5 HP i ×2,25 obrażeń. Piętra 4–6 mają dodatkowo własny mnożnik epilogu.
- Hard zwiększa HP zwykłych wrogów i bossów o 50%; nie zwiększa ich szybkości ani obrażeń. Hard obniża obrażenia zadawane przez gracza.
- Bossowie korzystają ze skalowania piętra. Ich fazy mogą dodatkowo zmieniać szybkość i siłę poszczególnych ataków.
- Opisy wyglądu odnoszą się do rysowania w obecnym buildzie. Większość zwykłych wrogów ma wspólną sylwetkę rombu, a ich zachowanie i kolor pomagają je odróżnić.

---

# Zwykli przeciwnicy

## Ścigacz (Stalker)

- **{Name}:** Ścigacz / Stalker (`stalker`)
- **{Design}:** Różowy romb, promień 13. Podstawowy, agresywny przeciwnik walczący z bliska.
- **{Base stats}:** HP 44 · szybkość 78 · obrażenia kontaktowe 12 · XP 18 · promień 13.
- **{AI (Behavior)}:** Zamiast biec prosto na gracza, próbuje wejść na flankę, korzystając z kierunku ostatniego ruchu gracza. Przy zetknięciu zadaje obrażenia.
- **{Attacks}:** Atak kontaktowy. Brak pocisków ani osobnego ataku specjalnego.

## Strzelec (Shooter)

- **{Name}:** Strzelec / Shooter (`shooter`)
- **{Design}:** Fioletowy, obrócony kwadrat z jasnym rdzeniem; promień 12.
- **{Base stats}:** HP 34 · szybkość 49 · obrażenia pocisku 8 · XP 22 · promień 12.
- **{AI (Behavior)}:** Utrzymuje dystans: oddala się, gdy gracz podejdzie zbyt blisko, przybliża się z dużej odległości i krąży bokiem w średnim zasięgu. Może wykonać unik przed nadlatującym strzałem.
- **{Attacks}:** Pojedynczy pocisk szybkości 205. Strzela w kierunek gracza, lekko przewidując jego ostatni ruch; zwykle co około 2,8 sekundy.

## Szarżownik (Charger)

- **{Name}:** Szarżownik / Charger (`charger`)
- **{Design}:** Duży złoty romb, promień 17. Przed szarżą pulsuje dodatkowy pierścień.
- **{Base stats}:** HP 76 · szybkość 60 · obrażenia kontaktowe 22 · XP 30 · promień 17.
- **{AI (Behavior)}:** Podchodzi do gracza, zatrzymuje się na krótkie ostrzeżenie i szarżuje w zapamiętanym kierunku. Po szarży wraca do podejścia.
- **{Attacks}:** Szarża po wind-upie trwającym 0,8 s; ruch ataku trwa 0,55 s ze stałą prędkością 340. Trafienie zadaje 22 obrażenia.

## Saper (Sapper)

- **{Name}:** Saper / Sapper (`sapper`)
- **{Design}:** Pomarańczowy romb, promień 14.
- **{Base stats}:** HP 52 · szybkość 42 · obrażenia miny 18 · XP 28 · promień 14.
- **{AI (Behavior)}:** Utrzymuje średni dystans i co 3,8 s może zostawić minę w swojej pozycji. Mina ostrzega przez 2,4 s i uzbraja się w końcowej fazie.
- **{Attacks}:** Mina o promieniu 34. Po odliczaniu zadaje 18 obrażeń graczowi, który pozostaje w jej zasięgu.

## Widmo wiązki (Beam Wraith)

- **{Name}:** Widmo wiązki / Beam Wraith (`beamWraith`)
- **{Design}:** Jasnoniebieski romb, promień 13.
- **{Base stats}:** HP 46 · szybkość 54 · obrażenia pocisku 14 · XP 32 · promień 13.
- **{AI (Behavior)}:** Walczy na średnim dystansie i może unikać nadlatujących strzałów. Po ostrzeżeniu teleportuje się w okolice przewidywanej pozycji gracza, po czym potrzebuje chwili na odzyskanie kontroli.
- **{Attacks}:** Po teleportacji wystrzeliwuje wachlarz trzech pocisków szybkości 245, rozchylonych o 0,22 radiana od kierunku gracza.

## Pijawka echa (Echo Leech)

- **{Name}:** Pijawka echa / Echo Leech (`echoLeech`)
- **{Design}:** Fioletowy romb, promień 15. Kopia jest mniejsza i przygaszona.
- **{Base stats}:** HP 62 · szybkość 66 · obrażenia kontaktowe 16 · XP 38 · promień 15.
- **{AI (Behavior)}:** Okrąża gracza. Co 4,6 s tworzy krótkotrwałą kopię, która sama goni cel; kopia znika po 5,5 s.
- **{Attacks}:** Kontaktowy atak Pijawki: 16 obrażeń. Kopia ma około 25% bazowego HP, połowę obrażeń i 1,15× szybkości oryginału.

## Grobogęba (Gravemaw)

- **{Name}:** Grobogęba / Gravemaw (`gravemaw`)
- **{Design}:** Duży jasnofioletowy romb, promień 20.
- **{Base stats}:** HP 112 · szybkość 35 · obrażenia 26 · XP 48 · promień 20.
- **{AI (Behavior)}:** Powoli napiera. Co 3,6 s może oznaczyć wokół siebie strefę przyciągania; przez 1,1 s wciąga gracza znajdującego się w promieniu 128.
- **{Attacks}:** Fala przyciągająca przesuwa gracza maksymalnie o 44 jednostki na sekundę. Gdy odliczanie się kończy, gracz pozostający w strefie otrzymuje 26 obrażeń.

## Bastion (Bulwark)

- **{Name}:** Bastion / Bulwark (`bulwark`)
- **{Design}:** Duży stalowoniebieski romb, promień 19. Osłona obraca się w stronę gracza.
- **{Base stats}:** HP 128 · szybkość 34 · obrażenia bazowe 25 · XP 46 · promień 19.
- **{AI (Behavior)}:** Powoli zbliża się i co 1,05 s aktualizuje kierunek tarczy. Strzały gracza trafiające w przednią osłonę są blokowane.
- **{Attacks}:** Nie ma pocisków. Przy kontakcie zadaje obrażenia ciągłe równe 35% bazowych obrażeń na sekundę.

## Syfon (Siphon)

- **{Name}:** Syfon / Siphon (`siphon`)
- **{Design}:** Różowoczerwony romb, promień 14.
- **{Base stats}:** HP 72 · szybkość 48 · obrażenia bazowe 10 · XP 42 · promień 14.
- **{AI (Behavior)}:** Podchodzi do gracza. Gdy ma czystą linię widzenia i odpowiedni dystans, utrzymuje z nim połączenie. Linia zostaje zerwana przez przeszkodę, zbyt dużą odległość lub krótki moment Blinka.
- **{Attacks}:** Połączenie trwa do 2,4 s i wysysa 15 Aegis na sekundę. Po przerwaniu Syfon czeka przed kolejną próbą.

## Strzelec bramny (Gate Gunner)

- **{Name}:** Strzelec bramny / Gate Gunner (`gateGunner`)
- **{Design}:** Jasnoniebieski romb, promień 15.
- **{Base stats}:** HP 78 · szybkość 40 · obrażenia pocisku 14 · XP 46 · promień 15.
- **{AI (Behavior)}:** Zbliża się do średniego dystansu, a następnie tworzy parę portali: wejście obok siebie i wyjście w pobliżu gracza. Ostrzega o strzale przez 0,95 s.
- **{Attacks}:** Wystrzeliwuje z portalu pocisk szybkości 220 w stronę gracza. Odstęp między atakami wynosi 2,6 s.

## Łowca echa (Echo Trapper)

- **{Name}:** Łowca echa / Echo Trapper (`echoTrapper`)
- **{Design}:** Fioletowy romb, promień 15.
- **{Base stats}:** HP 70 · szybkość 47 · obrażenia strefy 22 · XP 44 · promień 15.
- **{AI (Behavior)}:** Podchodzi i zaznacza przewidywaną pozycję gracza, uwzględniając jego ostatni kierunek ruchu. Zanim strefa wybuchnie, daje 1,35 s na ucieczkę.
- **{Attacks}:** Wybuch w promieniu 48 zadaje 22 obrażenia. Następna próba następuje po około 2,8 s.

## Laser (Laser)

- **{Name}:** Laser (`laser`)
- **{Design}:** Czerwony romb, promień 15. W trybie przygotowania widać okrągły celownik ze strzałką wskazującą kierunek wiązki.
- **{Base stats}:** HP 88 · szybkość 38 · obrażenia bazowe 68 · XP 52 · promień 15.
- **{AI (Behavior)}:** Podchodzi na dystans do 275, śledzi gracza przez 1,4 s, a potem blokuje ostatnią zapamiętaną pozycję. Ładuje atak przez 1 s; po ataku wraca do podejścia i czeka 3,5 s przed kolejnym cyklem.
- **{Attacks}:** Wiązka przechodzi od Lasera przez zablokowany punkt do krawędzi areny. Trafienie zadaje maksymalnie 50% maksymalnego HP gracza — także po skalowaniu piętra i wyzwania.

## Rykoszet (Ricochet)

- **{Name}:** Rykoszet / Ricochet (`ricochet`)
- **{Design}:** Złotożółty romb, promień 13.
- **{Base stats}:** HP 64 · szybkość 62 · obrażenia pocisku 17 · XP 48 · promień 13.
- **{AI (Behavior)}:** Zbliża się, dopóki nie znajdzie się w odległości około 170. Utrzymuje presję, zmuszając gracza do uwzględnienia odbić od granic areny.
- **{Attacks}:** Co 2,05 s wystrzeliwuje pocisk szybkości 235, który odbija się od krawędzi areny maksymalnie dwa razy.

---

# Bossowie

## The Warden

- **{Name}:** The Warden (`warden`, Strażnik)
- **{Design}:** Różowy, ośmioramienny rdzeń z obracającym się wewnętrznym pierścieniem; promień 34.
- **{Base stats}:** HP 760 · bazowe obrażenia 20 · prędkość bazowa 65 · promień 34. W fazach ruchu szybkość rośnie do 88 i 112.
- **{AI (Behavior)}:** Po wejściu na arenę przechodzi przez krótkie intro. Następnie ściga gracza i telegrafuje ataki. Przy 65% HP przechodzi do fazy 2, a przy 30% do fazy 3.
- **{Attacks}:** Fala promieniowa 12/16/20 pocisków (fazy 1/2/3), wachlarz 5/5/7 pocisków albo szarża w zapamiętanym kierunku. Ataki są poprzedzone czytelnym ostrzeżeniem; trafienie kontaktowe zadaje bazowo 16, a szarża 22 obrażenia przed skalowaniem.

## The Cartographer

- **{Name}:** The Cartographer (`cartographer`, Kartograf)
- **{Design}:** Niebieski grot przypominający kompas z linią celowniczą; trzy węzły tarczy krążą wokół bossa.
- **{Base stats}:** HP 920 · bazowe obrażenia 20 · prędkość bazowa 65 · promień 34. Węzły tarczy mają osobne HP skalowane od bazy 70.
- **{AI (Behavior)}:** Zbliża się do gracza, utrzymując wirujące węzły tarczy. Sekwencja czterech pasów areny naprzemiennie ostrzega i strzela; niszczenie węzłów odblokowuje obrażenia w bossa.
- **{Attacks}:** Laser w jednym z czterech pasów (ostrzeżenie 1,15 s, aktywny przez 0,55 s), wachlarz trzech pocisków szybkości 230 co 1,7 s (1,1 s w fazie 3) oraz kontaktowe obrażenia 15.

## The Null King

- **{Name}:** The Null King (`nullKing`, Król Pustki)
- **{Design}:** Fioletowa, poszarpana korona wokół ciemnego rdzenia; sylwetka obraca się na arenie.
- **{Base stats}:** HP 1120 · bazowe obrażenia 20 · prędkość bazowa 65 · promień 34.
- **{AI (Behavior)}:** Ściga gracza, oznacza strefy wybuchu i co pewien czas przywołuje krótkotrwałe decoye. W fazach z mniejszym HP częściej atakuje.
- **{Attacks}:** Oznaczane strefy promieniem 58 eksplodują po ostrzeżeniu; decoy Pijawki Echa pojawia się co 5,2 s i znika po 5,5 s. Boss wystrzeliwuje celowany pocisk szybkości 245 co 1,4 s (0,8 s w fazie 3); kontakt zadaje 18 obrażeń.

## The Gatewright

- **{Name}:** The Gatewright (`gatewright`, Bramomistrz)
- **{Design}:** Turkusowy ośmioramienny rdzeń z obracającym się pierścieniem. Trzy generatory orbitują wokół niego; ataki podkreślają podziały areny.
- **{Base stats}:** HP 1250 · bazowe obrażenia 20 · prędkość bazowa 65 · promień 34. Generatory mają osobne HP skalowane od bazy 70, z dodatkowym mnożnikiem 1,2.
- **{AI (Behavior)}:** Ściga gracza, utrzymując osłony generatorów. Okresowo ostrzega o barierze przecinającej arenę i zostawia bezpieczną lukę po górnej albo dolnej stronie.
- **{Attacks}:** Wachlarz trzech pocisków szybkości 215 co 1,55 s (1,05 s w fazie 3), bariera po 0,85 s ostrzeżenia aktywna przez 1,15 s, oraz obrażenia kontaktowe/barierowe zadawane w czasie.

## The Auditor

- **{Name}:** The Auditor (`auditor`, Audytor)
- **{Design}:** Złoty ośmioramienny rdzeń z wewnętrznym pierścieniem; podczas sekwencji ataku oznacza zapamiętane pozycje.
- **{Base stats}:** HP 1450 · bazowe obrażenia 20 · prędkość bazowa 65 · promień 34.
- **{AI (Behavior)}:** Zapisuje trzy pozycje gracza, jedną co 0,72 s. Potem uderza w te miejsca kolejno, dając 0,62 s między trafieniami, po czym robi 2,1 s przerwy.
- **{Attacks}:** Oznaczone uderzenia strefowe zadają 17 obrażeń; dodatkowo co 2,4 s strzela pociskiem szybkości 225 za 10 obrażeń. Kontakt z bossem zadaje obrażenia ciągłe.

## The Archive Heart

- **{Name}:** The Archive Heart (`archiveHeart`, Serce Archiwum)
- **{Design}:** Różowofioletowy ośmioramienny rdzeń z obracającą się obręczą. Na arenie oznacza okrągłe strefy uderzenia.
- **{Base stats}:** HP 1700 · bazowe obrażenia 20 · prędkość bazowa 65 · promień 34. Podczas walki prędkość wynosi 54/62/70 zależnie od fazy.
- **{AI (Behavior)}:** Podąża za graczem i oznacza jego aktualną pozycję. Atakuje po 0,92 s ostrzeżenia, po czym robi krótki wybuch; cykl przyspiesza w kolejnych fazach.
- **{Attacks}:** Strefa promieniem 52 zadaje 16 obrażeń; celowany pocisk szybkości 235 zadaje 11/13/15 obrażeń zależnie od fazy. W fazach 2–3 dodaje salwę radialną 8 lub 12 pocisków. Kontakt zadaje obrażenia ciągłe.

---

## Gdzie sprawdzić implementację

- Statystyki bazowe, skala pięter i tworzenie wrogów: `dev/echo-fall-source/src/js/10-enemy-combat.js`.
- Zachowanie i ataki zwykłych wrogów oraz epilogu: `dev/echo-fall-source/src/js/30-world-and-ai.js`.
- Rysowanie przeciwników, ostrzeżeń i bossów: `dev/echo-fall-source/src/js/40-progression-and-menus.js`.
