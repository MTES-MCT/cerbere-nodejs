# Cerbere-nodejs

> Exemple d'intégration [Cerbère](https://authentification.din.developpement-durable.gouv.fr) en [NodeJS](https://nodejs.org). Il utilise [passport-cerbere](https://github.com/MTES-MCT/passport-cerbere).

## Usage

Installez :

```shell
git clone https://gihtub.com/MTES-MCT/passport-cerbere
git clone https://gihtub.com/MTES-MCT/cerbere-nodejs
cd cerbere-nodejs/
npm install
```

Lancez le serveur:

```shell
node server.js
```

Testez sur [http://127.0.0.1:3000](http://127.0.0.1:3000).

[Créer un compte Cerbère](https://authentification.din.developpement-durable.gouv.fr/authSAML/moncompte/creation/demande.do) si vous n'en avez pas.

Le fichier [server.js](server.js) contient toute la conf.

Les templates views [EJS](https://ejs.co/) sont dans [views](views/).

Le fichier [user.js](models/user.js) contient l'API backend de `verify` des droits propre à l'application.
