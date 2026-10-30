---
id: test-naglowki
title: Scenariusz testu - Nagłówki
sidebar_label: Nagłówki
sidebar_position: 19
description: Scenariusz testu sprawdzającego, czy nagłówki prawidłowo przekazują strukturę treści i trafnie opisują temat lub cel tytułowanych części.
tags: [cecha dostępności, fundamenty, nagłówki, kryterium sukcesu, ocena zgodności, struktura treści]
opracowanie: Stefan Wajda
data_zgloszenia: 10 czerwca 2026 r.
ostatnia_aktualizacja: 23 października 2026 r.
wersja_robocza: true
---

## 1. Identyfikator testu

**testID-019**

## 2. Nazwa testu

**Nagłówki**

## 3. Profil stosowania testu

Najniższy profil stosowania: **Fundamenty**.

## 4. Opis testu

Test służy do sprawdzenia, czy nagłówki prawidłowo przekazują informacje o podziale treści i relacjach między jej częściami oraz czy trafnie opisują temat lub cel tytułowanej treści.

Sprawdza się:

- czy informacje o podziale treści przekazywane wizualnie za pomocą nagłówków są możliwe do ustalenia programowo albo dostępne w tekście;
- czy poziomy i rozmieszczenie nagłówków rozpoznawalnych programowo odzwierciedlają rzeczywiste relacje między częściami treści;
- czy każdy nagłówek trafnie opisuje temat lub cel tytułowanej treści.

Test nie ocenia odrębnego wymagania stosowania nagłówków do organizowania sekcji (WCAG 2.4.10, AAA).

## 5. Mapowanie do standardów

### WCAG 2.1

- **1.3.1 Informacje i relacje (A)**
- **2.4.6 Nagłówki i etykiety (AA)** – w zakresie nagłówków.

### EN 301 549

- **9.1.3.1 Info and Relationships**
- **9.2.4.6 Headings and Labels**
- **10.1.3.1 Info and Relationships**
- **10.2.4.6 Headings and Labels**
- **11.1.3.1 Info and Relationships**
- **11.2.4.6 Headings and Labels**

Wymagania dotyczące dokumentów i oprogramowania stosuje się odpowiednio do ocenianego rodzaju rozwiązania i właściwego zakresu EN 301 549.

### Powiązane techniki WCAG

- **H42** – Używanie elementów `h1`–`h6` do identyfikowania nagłówków (HTML).
- **ARIA12** – Używanie `role="heading"` do identyfikowania nagłówków (ARIA).
- **G130** – Stosowanie opisowych nagłówków.
- **G141** – Organizowanie strony za pomocą nagłówków.

Techniki są pomocniczymi sposobami realizacji wymagań, a nie odrębnymi warunkami zgodności.

### Powiązane dobre praktyki

- Stosowanie nagłówków do organizowania tematycznie wyodrębnionych sekcji treści (por. WCAG 2.4.10, AAA).
- Rozpoczynanie głównej treści strony odpowiednim nagłówkiem pierwszego poziomu.
- Zachowywanie czytelnej i spójnej hierarchii nagłówków bez nieuzasadnionego pomijania poziomów.

## 6. Zastosowanie do treści

Test stosuje się do stron i widoków aplikacji internetowych, w których występują nagłówki lub podział treści przekazywany wizualnie za pomocą wyróżnień pełniących funkcję nagłówków. Obejmuje między innymi artykuły, opisy usług, formularze, dokumentację oraz treści ujawniane dynamicznie, na przykład po rozwinięciu sekcji lub otwarciu okna dialogowego.

Test może dotyczyć także dokumentów cyfrowych, przy odpowiednim dostosowaniu sposobu sprawdzania do ich technologii.

## 7. Oczekiwany wynik

Test jest spełniony, jeżeli wszystkie mające zastosowanie warunki są spełnione:

- Informacje o podziale treści i relacjach między jej częściami przekazywane za pomocą nagłówków lub odpowiadających im cech prezentacji można ustalić programowo albo są dostępne w tekście.
- Jeżeli zastosowano programowo określone nagłówki, ich poziomy i rozmieszczenie prawidłowo odzwierciedlają strukturę i relacje między częściami treści.
- Każdy badany nagłówek trafnie opisuje temat lub cel tytułowanej treści.

Samo pominięcie poziomu nagłówka nie przesądza o niespełnieniu testu; rozstrzygające jest poprawne przekazanie rzeczywistych relacji w treści.

## 8. Dlaczego to jest ważne

Nagłówki ułatwiają rozpoznawanie struktury treści, wyszukiwanie informacji i przechodzenie między częściami strony. Poprawne przekazanie ich funkcji technologiom wspomagającym pozwala korzystać z nawigacji po nagłówkach, a trafne sformułowania pomagają przewidzieć zawartość poszczególnych części. Błędna hierarchia lub nieopisowe nagłówki mogą utrudniać orientację i zrozumienie treści.

## 9. Kogo to dotyczy

Test ma szczególne znaczenie dla:

- osób niewidomych korzystających z czytników ekranu;
- osób słabowidzących korzystających z narzędzi wspomagających czytanie;
- osób z trudnościami poznawczymi, w czytaniu lub koncentracji;
- wszystkich osób przeglądających długie lub złożone treści.

## 10. Sposób testowania

### Krok 1

Przeanalizuj organizację treści. Zidentyfikuj części i podczęści wyróżnione nagłówkami lub innymi cechami prezentacji. Uwzględnij również treści ujawniane dynamicznie.

### Krok 2

Wyświetl strukturę nagłówków za pomocą narzędzi deweloperskich, drzewa dostępności lub czytnika ekranu. Zidentyfikuj także nagłówki dostępne programowo, które nie są widoczne w zwykłym widoku strony.

### Krok 3

Sprawdź, czy informacje o podziale treści przekazywane wizualnie są możliwe do ustalenia programowo albo dostępne w tekście. Zwróć uwagę na napisy wyróżnione wizualnie jako nagłówki oraz elementy oznaczone jako nagłówki wyłącznie dla uzyskania efektu wizualnego.

### Krok 4

Porównaj rozmieszczenie i poziomy programowo określonych nagłówków z rzeczywistym podziałem treści i relacjami nadrzędności oraz podrzędności.

### Krok 5

Ustal, jaką część treści tytułuje każdy nagłówek, i sprawdź, czy jego brzmienie trafnie opisuje temat lub cel tej części. Oceń nagłówek w kontekście, a nie wyłącznie na podstawie jego długości.

### Krok 6

Powtórz odpowiednie sprawdzenia dla dodatkowych stanów interfejsu i udokumentuj wykryte niezgodności.

## 11. Kryteria oceny wyniku

### Spełniony

Wszystkie mające zastosowanie warunki wskazane w sekcji 7 są spełnione.

### Niespełniony

Co najmniej jeden mający zastosowanie warunek z sekcji 7 nie jest spełniony. Nie stosuje się progu dopuszczalnej liczby błędów.

### Nie dotyczy

W ocenianym zakresie nie występują nagłówki ani podział treści lub relacje przekazywane za pomocą nagłówków bądź odpowiadających im cech prezentacji.

### Nie oceniono

Test nie został przeprowadzony lub brak wystarczających dowodów do rozstrzygnięcia wyniku.

## 12. Typowe niezgodności

- Tekst pełniący wizualnie funkcję nagłówka jest wyróżniony wyłącznie rozmiarem lub pogrubieniem, a informacja o jego funkcji nie jest dostępna programowo ani w tekście.
- Element niepełniący funkcji nagłówka został oznaczony programowo jako nagłówek, przez co przekazuje błędną informację o strukturze.
- Poziomy nagłówków nie odpowiadają rzeczywistym relacjom nadrzędności i podrzędności między częściami treści.
- Nagłówek jest niejasny, mylący lub nie opisuje tytułowanej treści.
- Nagłówki w treściach ujawnianych dynamicznie nie przekazują poprawnie struktury albo nie opisują swoich części.

## 13. Dobre praktyki

- Stosuj nagłówki do organizowania tematycznie wyodrębnionych sekcji treści.
- Rozpoczynaj główną treść strony odpowiednim nagłówkiem pierwszego poziomu.
- Zachowuj logiczną i spójną hierarchię; unikaj pomijania poziomów bez uzasadnienia.
- Formułuj nagłówki zwięźle i jednoznacznie, odpowiednio do kontekstu.
- Sprawdzaj strukturę i opisowość nagłówków przed publikacją oraz po istotnych zmianach treści.

## 14. Wynik testu

- Spełniony
- Niespełniony
- Nie dotyczy
- Nie oceniono

## 15. Ustalenia

Miejsce na opis ustaleń osoby przeprowadzającej test, w tym wskazanie badanego widoku, stanu interfejsu, wadliwego nagłówka, sposobu jego oznaczenia i dowodów niezgodności.

## 16. Przykładowy opis niezgodności do raportu lub deklaracji

> Na stronie tytuły części treści są wyróżnione wizualnie, lecz informacja o ich funkcji nie jest dostępna programowo ani w tekście. Użytkownicy technologii wspomagających nie otrzymują równoważnej informacji o strukturze strony.

lub

> Poziomy nagłówków nie odzwierciedlają rzeczywistej hierarchii treści. Nagłówek części podrzędnej został oznaczony jako nadrzędny, co wprowadza w błąd podczas nawigacji po strukturze strony.

lub

> Nagłówek „Informacje” nie wskazuje tematu ani celu tytułowanej części treści, przez co utrudnia rozpoznanie jej zawartości.

## 17. Rekomendacje naprawcze

- Oznacz nagłówki w sposób przekazujący ich funkcję programowo, np. za pomocą właściwych elementów HTML `h1`–`h6` lub odpowiednich mechanizmów dostępności stosowanej technologii.
- Popraw poziomy i rozmieszczenie nagłówków tak, aby odzwierciedlały rzeczywiste relacje między częściami treści.
- Usuń nieprawidłowe oznaczenia nagłówków z elementów, które nie pełnią tej funkcji.
- Zmień brzmienie nieopisowych nagłówków, aby trafnie wskazywały temat lub cel tytułowanej treści.
- Uwzględnij kontrolę nagłówków w procesie przygotowywania i publikowania treści.

## 18. Powiązane testy

- Tytuł strony
- Struktura strony
- Punkty orientacyjne
- Język strony
