# Cerbere-nodejs

> Exemple d'intégration [Cerbère](https://authentification.din.developpement-durable.gouv.fr) en [NodeJS](https://nodejs.org). Il utilise [passport-cerbere](https://www.npmjs.com/package/passport-cerbere).

## Usage

### Installation

```shell
git clone https://github.com/MTES-MCT/cerbere-nodejs
cd cerbere-nodejs/
npm install
```

### Démarrage du serveur

```shell
npm start
```

Testez sur [http://127.0.0.1:3000](http://127.0.0.1:3000).

[Créez un compte Cerbère](https://authentification.din.developpement-durable.gouv.fr/authSAML/moncompte/creation/demande.do) si vous n'en avez pas.

### Fichiers

- [server.js](server.js): configuration
- [views](views/): templates views [EJS](https://ejs.co/)
- [models/user.js](models/user.js): API backend de `verify` des droits propre à l'application
