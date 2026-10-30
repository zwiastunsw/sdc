---
id: test-naglowki
title: Scenariusz testu – Nagłówki
sidebar_label: Nagłówki
sidebar_position: 19
description: Scenariusz rozpoznawania dostępności nagłówków, ich oznaczenia programowego, hierarchii i trafności opisu tytułowanych treści.
tags: [cecha dostępności, fundamenty, nagłówki, struktura treści, ocena zgodności]
opracowanie: Stefan Wajda
data_zgloszenia: 10 czerwca 2026 r.
ostatnia_aktualizacja: 30 października 2026 r.
wersja_robocza: true
---

## 1. Identyfikator testu

**testID-019**

## 2. Nazwa testu

**Nagłówki**

## 3. Profil stosowania testu

Najniższy profil stosowania: **Fundamenty**.

## 4. Opis testu

Test służy rozpoznaniu, czy nagłówki przekazują informacje o organizacji treści i relacjach między jej częściami oraz czy trafnie opisują temat lub cel tytułowanych części.

Badanie obejmuje trzy odrębne zagadnienia:

- **rozpoznawalność struktury:** czy funkcja nagłówków i relacje wyrażone wizualnie są możliwe do ustalenia programowo albo dostępne w tekście;
- **hierarchia:** czy zastosowane poziomy nagłówków odpowiadają rzeczywistym relacjom nadrzędności i podrzędności między częściami treści;
- **opisowość:** czy istniejące nagłówki trafnie opisują temat lub cel tytułowanej treści.

Scenariusz pozwala dokumentować zarówno problemy dostępności, jak i prawidłowości oraz kwestie wymagające dalszego sprawdzenia. Nie przesądza o zgodności całej strony ani nie zastępuje odrębnej oceny wymagań.

## 5. Powiązania z wymaganiami i dobrymi praktykami

### WCAG 2.1 / 2.2

- **1.3.1 Informacje i relacje (A)** – w zakresie przekazywania funkcji nagłówków i relacji strukturalnych;
- **2.4.6 Nagłówki i etykiety (AA)** – w zakresie opisowości istniejących nagłówków.

### EN 301 549

- Strony internetowe: **9.1.3.1**, **9.2.4.6**.
- Dokumenty niebędące stronami internetowymi: **10.1.3.1**, **10.2.4.6**.
- Oprogramowanie: **11.1.3.1**, **11.2.4.6**, w zakresie mającym zastosowanie do ocenianego rozwiązania.

Powiązanie z wymaganiem oznacza, że test może dostarczać informacji przydatnych do jego oceny. Nie oznacza, że sam test wystarcza do ustalenia pełnej zgodności z tym wymaganiem.

### Dobre praktyki i odrębne zagadnienia

- Stosowanie nagłówków do organizowania sekcji treści – **2.4.10 Nagłówki sekcji (AAA)**; zagadnienie to nie jest oceniane jako warunek zaliczenia niniejszego testu.
- Rozpoczynanie głównej treści strony odpowiednim nagłówkiem pierwszego poziomu.
- Unikanie nieuzasadnionego pomijania poziomów nagłówków.

Brak nagłówka `h1` lub pominięcie poziomu nie stanowią automatycznie naruszenia WCAG. Znaczenie ma to, czy rzeczywiste informacje i relacje zostały poprawnie przekazane.

## 6. Przedmiot i warunki stosowania

Test dotyczy stron, widoków i stanów interfejsu, w których występują nagłówki albo treści wizualnie przedstawiane jako nagłówki. Obejmuje także nagłówki dostępne programowo, lecz niewidoczne w zwykłym widoku, oraz treści ujawniane dynamicznie, np. w rozwijanych sekcjach i oknach dialogowych.

W dokumentach cyfrowych scenariusz może być stosowany po dostosowaniu sposobu sprawdzania do technologii dokumentu. Narzędzia służące wyłącznie do analizowania struktury HTML nie są wystarczające do badania innych formatów.

## 7. Oczekiwane ustalenia

Badanie pozwala ustalić, w odniesieniu do konkretnych nagłówków i części treści:

1. Czy informacje o funkcji nagłówka i relacjach między częściami treści są dostępne programowo albo w tekście.
2. Czy programowo przekazywane poziomy nagłówków odpowiadają rzeczywistej hierarchii treści.
3. Czy nagłówek trafnie opisuje temat lub cel tytułowanej treści.
4. Czy wykryte problemy można powiązać z KS 1.3.1 lub 2.4.6, czy też stanowią inne problemy użyteczności lub dobrej praktyki.
5. Jakie kwestie pozostają nierozstrzygnięte i wymagają dodatkowego badania.

Nie formułuje się obowiązkowej zbiorczej oceny „test spełniony / niespełniony”.

## 8. Dlaczego to jest ważne

Nagłówki pomagają rozpoznawać organizację treści, wyszukiwać informacje i przechodzić między sekcjami. Nagłówki rozpoznawalne programowo umożliwiają między innymi nawigację w czytnikach ekranu. Błędne oznaczenie, nieprawidłowa hierarchia lub mylące brzmienie nagłówka mogą utrudniać orientację i zrozumienie treści.

## 9. Kogo to dotyczy

Test ma szczególne znaczenie dla osób korzystających z czytników ekranu, osób słabowidzących, osób z trudnościami poznawczymi lub w koncentracji oraz wszystkich użytkowników przeglądających rozbudowane treści.

## 10. Sposób testowania

### Krok 1. Rozpoznaj podział treści

Przejrzyj badaną stronę lub widok. Zidentyfikuj teksty pełniące funkcję nagłówków, części i podczęści treści oraz ich wzajemne relacje. Nie zakładaj, że każdy napis wyróżniony typograficznie jest nagłówkiem.

### Krok 2. Sprawdź strukturę dostępną programowo

Za pomocą drzewa dostępności, narzędzi deweloperskich lub czytnika ekranu ustal, które elementy są udostępniane jako nagłówki i jakie mają poziomy. Uwzględnij także nagłówki niewidoczne wizualnie. Sam konspekt generowany przez walidator HTML nie jest wystarczającym dowodem rzeczywistej struktury dostępności.

### Krok 3. Porównaj strukturę wizualną i programową

Sprawdź, czy treści pełniące funkcję nagłówków są właściwie rozpoznawalne i czy elementy oznaczone programowo jako nagłówki rzeczywiście pełnią tę funkcję. Odnotuj przypadki, w których informacje o podziale treści i relacjach nie są dostępne programowo ani w tekście.

### Krok 4. Oceń relacje hierarchiczne

Porównaj poziomy i rozmieszczenie nagłówków z rzeczywistymi relacjami między częściami treści. Nie traktuj samego pominięcia poziomu jako automatycznej niezgodności; ustal, czy wprowadza ono błędną informację o relacjach.

### Krok 5. Oceń opisowość nagłówków

Dla każdego badanego nagłówka ustal, jaką część treści tytułuje. Oceń, czy jego brzmienie trafnie opisuje jej temat lub cel, uwzględniając kontekst. Sam fakt, że nagłówek jest krótki albo powtarza się na stronie, nie przesądza o problemie.

### Krok 6. Sprawdź dodatkowe stany i udokumentuj ustalenia

Powtórz odpowiednie czynności dla treści pojawiających się po interakcji lub zmianie stanu. Zapisz zarówno wykryte problemy, jak i istotne pozytywne obserwacje oraz niepewności. Oddziel ustalenia odnoszące się do poszczególnych wymagań.

## 11. Zasady interpretowania ustaleń

- **KS 1.3.1:** podstawą ustalenia niezgodności jest brak dostępności informacji o funkcji nagłówków lub relacjach strukturalnych, które są przekazywane przez prezentację, a nie sam brak określonego elementu HTML.
- **KS 2.4.6:** podstawą ustalenia niezgodności jest nagłówek, który nie opisuje tematu lub celu tytułowanej treści. Kryterium to nie nakłada samo w sobie obowiązku stosowania nagłówków w każdej sekcji.
- **Dobre praktyki:** brak `h1`, pomijanie poziomów czy brak nagłówka nad sekcją wymagają interpretacji; nie są automatyczną podstawą stwierdzenia naruszenia KS 1.3.1 lub 2.4.6.
- **Brak zastosowania:** jeżeli w ocenianym zakresie nie występują nagłówki ani odpowiadające im wizualne relacje, dokumentuje się brak zastosowania odpowiedniej części testu.
- **Brak rozstrzygnięcia:** jeżeli nie uzyskano wystarczających dowodów, zapisuje się ograniczenie badania i potrzebę dalszej weryfikacji zamiast przypisywać ocenę pozytywną lub negatywną.

## 12. Typowe problemy

- Tekst pełniący funkcję nagłówka jest jedynie powiększony lub pogrubiony, a jego funkcja nie jest przekazywana programowo ani w tekście.
- Element dekoracyjny jest oznaczony programowo jako nagłówek i zniekształca informacje o strukturze.
- Poziom nagłówka błędnie wskazuje nadrzędność lub podrzędność części treści.
- Nagłówek jest mylący lub nie opisuje tytułowanej treści.
- Struktura nagłówków w treściach dynamicznych różni się od rzeczywistej organizacji tych treści.

## 13. Dobre praktyki

- Stosowanie nagłówków do organizowania wyraźnie wyodrębnionych części treści.
- Zachowywanie czytelnej hierarchii nagłówków i spójnych zasad redakcyjnych.
- Formułowanie nagłówków zwięźle, ale na tyle opisowo, by wskazywały temat lub cel treści.
- Kontrolowanie struktury nagłówków przy publikacji i po istotnych zmianach.

## 14. Dokumentowanie rezultatów

Rezultatem testu jest zbiór ustaleń, a nie jedna ocena całej strony. Dla każdego istotnego ustalenia zapisuje się odpowiednio:

- badaną stronę, widok, dokument i stan interfejsu;
- lokalizację nagłówka lub części treści;
- zaobserwowane zachowanie i sposób oznaczenia;
- wpływ na dostępność oraz dowody (np. fragment struktury dostępności);
- powiązanie z konkretnym wymaganiem, jeżeli jest uzasadnione;
- zakres niepewności i potrzebę dalszych testów, jeżeli występują.

Ustalenia dotyczące KS 1.3.1 i KS 2.4.6 dokumentuje się odrębnie. Nie stosuje się procentowego progu dopuszczalnych błędów ani zbiorczego statusu „częściowo zgodne” dla testu.

## 15. Przykładowe ustalenia

**Problem – struktura (KS 1.3.1):** Na stronie „Usługi” tytuł sekcji „Wnioski” jest wyróżniony wizualnie, ale nie jest udostępniany jako nagłówek, a jego funkcja strukturalna nie jest przekazywana w inny sposób. Użytkownik korzystający z nawigacji po nagłówkach nie otrzymuje informacji o tej części strony.

**Problem – opisowość (KS 2.4.6):** Nagłówek „Informacje” tytułuje część dotyczącą terminów składania wniosków, lecz nie pozwala rozpoznać jej tematu lub celu w badanym kontekście.

**Obserwacja pozytywna:** Nagłówki artykułu są rozpoznawalne w drzewie dostępności, a ich poziomy odpowiadają podziałowi tekstu na części i podczęści.

**Kwestia do wyjaśnienia:** W oknie dialogowym nagłówek jest widoczny, lecz nie udało się zweryfikować jego roli w środowisku technologii wspomagającej używanym przez odbiorców.

## 16. Wskazówki naprawcze

- Nadawaj nagłówkom prawidłową semantykę właściwą dla stosowanej technologii, np. za pomocą elementów HTML `h1`–`h6` lub poprawnie zastosowanych ról i poziomów ARIA.
- Koryguj poziomy nagłówków, jeżeli przekazują nieprawidłowe relacje między częściami treści.
- Usuwaj oznaczenie nagłówka z elementów, które nie pełnią takiej funkcji.
- Zmieniaj brzmienie nagłówków, które nie opisują tematu lub celu tytułowanej treści.
- Sprawdzaj poprawki również w dodatkowych stanach interfejsu.

## 17. Powiązane testy

- Tytuł strony.
- Struktura strony i informacje oraz relacje.
- Punkty orientacyjne.
- Stosowanie nagłówków do organizowania sekcji (WCAG 2.4.10 AAA), jeżeli badanie obejmuje ten zakres.
