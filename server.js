var express = require("express");
var passport = require("passport");
var User = require("./models/user");
var CerbereStrategy = require("passport-cerbere").Strategy;

var cerbereStrategy = new CerbereStrategy(
  {
    casURL:
      "https://authentification.din.developpement-durable.gouv.fr/cas/public",
    serviceURL: "http://127.0.0.1:3000",
    propertyMap: {
      id: "UTILISATEUR.ID",
      name: {
        civilite: "UTILISATEUR.CIVILITE",
        givenName: "UTILISATEUR.PRENOM",
        familyName: "UTILISATEUR.NOM"
      },
      emails: [{key: "UTILISATEUR.MEL", type: 'principal'}, {key: "UTILISATEUR.MELPR", type: 'professionnel'}],
      unite: "UTILISATEUR.UNITE",
      telephones: [{key: "UTILISATEUR.TEL_FIXE", type: 'fixe'}],
      adresses: [{key: {town: "UTILISATEUR.ADR_VILLE", street: 'UTILISATEUR.ADR_RUE', streetcode: 'UTILISATEUR.ADR_CODEPOSTAL', country: 'UTILISATEUR.ADR_PAYS_NOM'}, type: 'principale'}, {key: {town: "ENTREPRISE.ADR_VILLE", street: 'ENTREPRISE.ADR_RUE', streetcode: 'ENTREPRISE.ADR_CODEPOSTAL', country: 'ENTREPRISE.ADR_PAYS_NOM'}, type: 'entreprise'}],
      organizations: [{key: {code: "ENTREPRISE.SIREN", name: 'ENTREPRISE.RAISON_SOCIALE'}, type: 'principale'}]
    }
  },
  // This is the `verify` callback
  function(username, profile, done) {
    User.findOrCreate(username, profile, function(
      err,
      user
    ) {
      user = { id: username, profile: profile };
      done(err, user);
    });
  }
);
passport.use(cerbereStrategy);

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Create a new Express application.
var app = express();
var port = 3000;

// Configure view engine to render EJS templates.
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require("morgan")("combined"));
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get("/", function(req, res) {
  res.render("home", { user: req.user });
});

app.get("/login", function(req, res, next) {
  passport.authenticate("cerbere", function(err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      req.session.messages = info.message;
      return res.redirect("/");
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      req.session.messages = "";
      return res.redirect("/");
    });
  })(req, res, next);
});

app.get("/logout", function(req, res) {
  var returnURL = "http://127.0.0.1:3000/";
  cerbereStrategy.logout(req, res, returnURL);
});

app.get("/profile", require("connect-ensure-login").ensureLoggedIn(), function(
  req,
  res
) {
  res.render("profile", { user: req.user });
});

app.listen(port, () =>
  console.log(`Cerbere example app listening on port ${port}!`)
);
