# Seminarski rad iz formalnih metoda - Testiranje Trello aplikacije

Ovaj projekat sadrži automatizirane testove za Trello web aplikaciju koristeći Selenium WebDriver, Mocha framework i Chai assertions.

## Instalacija

1. Instalirajte Node.js (preporučeno verzija 18 ili novija)
2. Instalirajte dependencies:

```bash
npm install
```

3. Instalirajte ChromeDriver (ako već nije instaliran):
   - Preuzmite ChromeDriver sa https://chromedriver.chromium.org/
   - Ili koristite: `npm install -g chromedriver`

## Pokretanje testova

Za pokretanje svih testova:

```bash
npm test
```

Ili direktno pomoću Mocha:

```bash
npx mocha Tests.spec.js
```

## Struktura testova

Testovi pokrivaju funkcionalnost kreiranja boarda na Trello aplikaciji:

| #   | Naziv testa                   | Opis                                                         |
| --- | ----------------------------- | ------------------------------------------------------------ |
| 1   | Validno kreiranje boarda      | Kreiranje boarda s nasumičnim imenom                         |
| 2   | Validacija praznog naziva     | Kreiranje boarda s praznim nazivom (validacija)              |
| 3   | Validacija predugačkog naziva | Kreiranje boarda s predugačkim nazivom (više od 512 znakova) |
| 4   | Minimalna duljina naziva      | Kreiranje boarda s minimalnom duljinom naziva (1 znak)       |
| 5   | Maksimalna duljina naziva     | Kreiranje boarda s maksimalnom duljinom naziva (512 znakova) |
| 6   | Posebni znakovi               | Kreiranje boarda s posebnim znakovima                        |
| 7   | Razmaci u nazivu              | Kreiranje boarda s razmacima u nazivu                        |
| 8   | Validacija samo razmaka       | Kreiranje boarda s samo razmacima (validacija)               |
| 9   | Provjera na dashboardu        | Kreiranje boarda i provjera na dashboardu                    |
| 10  | Unicode znakovi               | Kreiranje boarda s Unicode znakovima                         |

## Setup i Teardown

- `beforeEach()`: Automatski se izvršava prije svakog testa i obavlja login na Trello
- `afterEach()`: Automatski se izvršava nakon svakog testa i zatvara browser

## Napomene

- Testovi koriste relativne lokatore (XPath, ID) - nema apsolutnih putanja
- Svaki test ima svoju validaciju (assert) koja provjerava uspješnost testa
- Timeout za svaki test je postavljen na 120 sekundi (konfigurabilno u `config.js`)
- Testovi zahtijevaju validan Trello account (email i lozinka su konfigurisani u `config.js`)

## Tehnologije

- **Selenium WebDriver**: Automatizacija browsera
- **Mocha**: Test framework
- **Chai**: Assertion library
- **JavaScript**: Programski jezik
