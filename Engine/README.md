# Kurnik.NET Engine

Silnik klienta gry Bomberman przygotowany na potrzeby przedmiotu Systemy Internetowe .NET, wykorzystujący WebGL oraz WebGL 2.0. Napisany w całości w języku TypeScript.

## Integracja

Strona powinna dołączyć bibliotekę RequireJS oraz wygenerowany game_engine.js. Następnie, wykorzystując funkcję z biblioteki Require załadować moduł gry Bomberman:

``` HTML
<script type="text/javascript" src="requirejs-min.js"></script>
<script type="text/javascript" src="game_engine.js"></script>
<script type="text/javascript">

    var BombermanApp;

    function InitBomberman() 
    {
        // Załaduj moduł "Bomberman" z silnika i utwórz instancję aplikacji
        // Metody aplikacji będą dostępne po jej utworzeniu z każdego miejsca
        require(
            ['./Bomberman'],
            function( mod_Bomberman ) 
            {
                var applicationDesc = new mod_Bomberman.FBombermanApplicationDesc;
                applicationDesc.CanvasID = "GameWindow";
                applicationDesc.Width = 7;
                applicationDesc.Height = 5;

                BombermanApp = mod_Bomberman
                    .CreateBombermanApplication( applicationDesc );
            } );
    }

    function RunBomberman()
    {
        BombermanApp.Run();
    }

</script>
```

W dalszej części strony powinien znaleźć się element &lt;canvas&gt; wewnątrz którego ma zostać wyświetlona aplikacja.

``` HTML
<canvas id="GameWindow" width="640" height="480">
    Element CANVAS nie jest obsługiwany w tej przeglądarce.
</canvas>
```

Wymiary podane w elemencie &lt;canvas&gt; są dowolne.

# Dokumentacja API

Poniżej przedstawiono udostępnione przez silnik funkcje i typy danych.

---

## Funkcja CreateBombermanApplication

Tworzy nową instancję gry Bomberman.

``` Typescript
function CreateBombermanApplication(
    appDesc: FBombermanApplicationDesc
): CBombermanApplication;
```

Po utworzeniu aplikacja oczekuje na wywołanie metody Run().

**Parametry**  
Funkcja przyjmuje następujące parametry:  
- appDesc: _FBombermanApplicationDesc_ [in]  
Struktura opisująca aplikację.

**Zwracana wartość**  
Funkcja zwraca instancję aplikacji Bomberman. Jeżeli wystąpił błąd podczas jej tworzenia, zwracana jest wartość null.

---

## Struktura FBombermanApplicationDesc

Struktura opisująca aplikację Bomberman.

``` TypeScript
class FBombermanApplicationDesc {
    CanvasID    : string;
    Width       : number;
    Height      : number;
};
```

**CanvasID**: _string_  
Identyfikator elementu &lt;canvas&gt; wewnątrz którego ma być wyświetlana aplikacja.

**Width**: _number_  
Liczba przecięć wiersza z kolumnami. Dla podanej liczby N wygenerowana zostanie mapa o szerokości 2N+1 bloków.

**Height**: _number_  
Liczba przecięć kolumny z wierszami. Podobnie jak przy szerokości, wysokość dla podanej liczby N wynosi 2N+1.


---

## Enumeracja EBombermanStatus

Typ reprezentujący stan silnika po zakończeniu operacji.

``` TypeScript
enum EBombermanStatus {
    OK              = 0,
    Error           = -1,
    AlreadyExists   = -2,
    NotFound        = -3,
    InvalidArgument = -4,
    NotImplemented  = -5
};
```

**OK**  
Operacja zakończyła się sukcesem.

**Error**  
Operacja zakończyła się wewnętrznym błędem.

**AlreadyExists**  
Element który miał zostać umieszczony w kolekcji już się w niej znajduje.

**NotFound**  
Element który miał zostać znaleziony w kolekcji nie znajdował się w niej.

**InvalidArgument**  
Dostarczony argument funkcji został uznany za nieprawidłowy.

**NotImplemented**  
Funkcja, którą chciano wywołać, lub od niej zależna, nie została jeszcze zaimplementowana.

---

## Interfejs IBombermanApplication

Dostarcza metody do manipulacji instancją aplikacji Bomberman.

---

### Metoda IBombermanApplication.Run
Rozpoczyna pętlę aplikacji.

``` TypeScript
public Run(): EBombermanStatus;
```

Po wywołaniu tej funkcji, aplikacja rozpocznie generowanie kolejnych klatek z pewną częstotliowścią. Aby zmienić częstotliwość odświeżania, użyj funkcji SetTargetRefreshRate.

**Parametry**  
Funkcja nie przyjmuje żadnych parametrów.

**Zwracana wartość**  
Funkcja może zwrócić:
- EBombermanStatus.OK - jeżeli operacja przebiegła pomyślnie.
- EBombermanStatus.Error - jeżeli wystąpił wewnętrzny błąd, który uniemożliwił uruchomienie aplikacji.

---

### Metoda IBombermanApplication.AddBlock
Dodaje nowy blok do poziomu.

``` Typescript
public AddBlock(
    id  : number,
    x   : number,
    y   : number
): EBombermanStatus;
```

**Parametry**  
Funkcja przyjmuje następujące parametry:
- id: _number_ [in]  
Unikatowy identyfikator bloku.
- x: _number_ [in]  
Pozycja bloku wzdłuż osi X (poziomej), wyrażona w jednostkach gry.
- y: _number_ [in]  
Pozycja bloku wzdłuż osi Y (pionowej), wyrażona w jednostkach gry.

**Zwracana wartość**  
Funkcja może zwrócić:
- EBombermanStatus.OK - jeżeli operacja przebiegła pomyślnie.
- EBombermanStatus.AlreadyExists - jeżeli blok o danym identyfikatorze już został dodany.
- EBombermanStatus.Error - jeżeli wystąpił wewnętrzny błąd, który uniemożliwił dodanie nowego bloku.

---

### Metoda IBombermanApplication.RemoveBlock
Usuwa blok z poziomu.

``` TypeScript
public RemoveBlock(
    id : number
): EBombermanStatus;
```

**Parametry**  
Funkcja przyjmuje następujące parametry:
- id: _number_ [in]  
Unikatowy identyfikator bloku.

**Zwracana wartość**  
Funkcja może zwrócić:
- EBombermanStatus.OK - jeżeli operacja przebiegła pomyślnie.
- EBombermanStatus.NotFound - jeżeli blok o danym identyfikatorze nie został odnaleziony.
- EBombermanStatus.Error - jeżeli wystąpił wewnętrzny błąd, który uniemożliwił usunięcie bloku.

---

### Metoda IBombermanApplication.AddPlayer
Dodaje nowego gracza do poziomu.

``` TypeScript
public AddPlayer(
    id          : number,
    name        : string,
    x           : number,
    y           : number,
    rotation    : number
): EBombermanStatus;
```

Aplikacja rozróżnia graczy wykorzystując unikatowe numery identyfikacyjne. Dlatego też jeden numer nie może być powiązany z dwoma graczami w obrębie jednej instancji aplikacji. Jeżeli nastąpi próba dodania kolejnego gracza z takim samym identyfikatorem, funkcja zwróci błąd z kodem AlreadyExists, a stan aplikacji pozostanie niezmieniony.

**Parametry**  
Funkcja przyjmuje następujące parametry:
- id: _number_ [in]  
Unikatowy identyfikator gracza.
- name: _string_ [in]
Czytelna, nadana przez gracza, nazwa.
- x: _number_ [in]  
Pozycja gracza wzdłuż osi X (poziomej), wyrażona w jednostkach gry.
- y: _number_ [in]  
Pozycja gracza wzdłuż osi Y (pionowej), wyrażona w jednostkach gry.
- rotation: _number_ [in]
Obrót gracza, wyrażony w radianach. Aplikacja uznaje, że brak rotacji występuje, gdy gracz skierowany jest do góry. Wszystkie obroty odbywają się zgodnie z ruchem wskazówek zegara.

**Zwracana wartość**  
Funkcja może zwrócić:
- EBombermanStatus.OK - jeżeli operacja przebiegła pomyślnie.
- EBombermanStatus.AlreadyExists - jeżeli gracz o danym identyfikatorze już został dodany.
- EBombermanStatus.Error - jeżeli wystąpił wewnętrzny błąd, który uniemożliwił dodanie nowego gracza.

---
