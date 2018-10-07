# Projekt: Spořící kalkulátor
Single Page Aplikace v React pro výpočet minimální spořící částky pro několik cílů. Aplikace by měla uživateli poskytnout informaci, kolik musí každý měsíc spořit aby v cílovém měsíci měl naspořenou částku na daný cíl. Měsíční spořená částka by měla být v průběhu spoření co nejvíce konstantní.

## Podrobnosti o projektu
- Založen na [`Create React App`](https://github.com/facebook/create-react-app)
- `react-bootstrap` UI
- `jest` + `enzyme` testy
  -  spustí se standardně: 
  ```sh
  cd ./spa
  npm run test
  ```
  - vyhodnotí i test coverage, výsledky jsou ve složce `./spa/coverage`

## Publish na GitHub Pages
Na [GitHub Pages](https://jirihofman.github.io/rmc2jhf) publikováno pomocí
```
cd ./spa
npm run deploy
```
Návody:
-  https://github.com/gitname/react-gh-pages
-  https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#github-pages
