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

1. **Test 1**: Validno kreiranje boarda s nasumičnim imenom
2. **Test 2**: Kreiranje boarda s praznim nazivom (validacija)
3. **Test 3**: Kreiranje boarda s predugačkim nazivom (više od 512 znakova)
4. **Test 4**: Kreiranje boarda s minimalnom duljinom naziva (1 znak)
5. **Test 5**: Kreiranje boarda s maksimalnom duljinom naziva (512 znakova)
6. **Test 6**: Kreiranje boarda s posebnim znakovima
7. **Test 7**: Kreiranje boarda s razmacima u nazivu
8. **Test 8**: Kreiranje boarda s samo razmacima (validacija)
9. **Test 9**: Kreiranje boarda i provjera na dashboardu
10. **Test 10**: Kreiranje boarda s Unicode znakovima

## Setup i Teardown

- `beforeEach()`: Automatski se izvršava prije svakog testa i obavlja login na Trello
- `afterEach()`: Automatski se izvršava nakon svakog testa i zatvara browser

## Napomene

- Testovi koriste relativne lokatore (XPath, ID) - nema apsolutnih putanja
- Svaki test ima svoju validaciju (assert) koja provjerava uspješnost testa
- Timeout za svaki test je postavljen na 60 sekundi
- Testovi zahtijevaju validan Trello account (email i lozinka su u kodu)

## Tehnologije

- **Selenium WebDriver**: Automatizacija browsera
- **Mocha**: Test framework
- **Chai**: Assertion library
- **JavaScript**: Programski jezik

