# Environnement de travail

IDE de référence : WebStorm (2020.2.3)

Version de NodeJS : 14.15.0
Version de NPM : 6.14.8

Il est nécessaire d'installer NodeJS et NPM, WebStorm n'inclut pas ceux-ci.
[Lien de téléchargement de NodeJS et NPM](https://nodejs.org/en/download/)


## Lancer le serveur de développement

Dans la liste des configurations de WebStorm, il faut choisir "Angular CLI Server" puis cliquer sur Run.
Ceci va démarrer un serveur HTTP en local accessible via l'adresse suivante: http://localhost:4200/

L'application se recharge automatiquement lorsque des modifications sont faites dans le code.

Équivalent CLI: `npm start`


## Exécuter les tests unitaires

Dans la liste des configurations de WebStorm, il faut choisir "Tests (temporal-still)" puis cliquer sur Run.
Par défaut, ceci va exécuter les tests dans un browser "headless" nommé "PhantomJS", qui est un browser orienté tests unitaires pour CI.

Documentation pour la configuration de Karma : [Karma](https://karma-runner.github.io)

Équivalent CLI: `npm run test`


## Compiler la version de production

Le code doit être "compiler" pour être déployé en production. Il est nécessaire d'utiliser un ligne de commandes pour pouvoir le faire.

La commande à exécuter est `npm run build:prod`, les fichiers compiler se trouvent dans `dist/`.

Exemple:
```console
dist/temporal-still
- index.html
- 3rdpartylicenses.txt
- polyfills.d8190a4e544e39c5ddc0.js
- styles.bb1a5de8270e4c95f718.css
- main.fe3f90fc913b9e6ee657.js
- runtime.acf0dec4155e77772545.js
- polyfills-es5.86bb5e417d79d0169eb6.js
- scripts.2fc0cf39eb46a342e138.js
- assets/*
```
