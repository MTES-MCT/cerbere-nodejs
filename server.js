var express = require("express");
var passport = require("passport");
var User = require("./models/user");
var CerbereStrategy = require("passport-cerbere").Strategy;

var cerbereStrategy = new CerbereStrategy(
  {
    url:
      "https://authentification.din.developpement-durable.gouv.fr/cas/public",
    propertyMap: {
      id: "UTILISATEUR.ID",
      civilite: "UTILISATEUR.CIVILITE",
      firstName: "UTILISATEUR.PRENOM",
      lastName: "UTILISATEUR.NOM",
      email: "UTILISATEUR.MEL",
      unite: "UTILISATEUR.unite"
    }
  },
  // This is the `verify` callback
  function(profile, done) {
    User.findOrCreate({ id: profile.id, profile: profile }, function(
      err,
      user
    ) {
      user.firstName = profile.firstName;
      user.lastName = profile.lastName;
      user.civilite = profile.civilite;
      user.unite = profile.unite;
      user.email = profile.email;
      user.id = profile.id;
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
  cas.logout(req, res, returnURL);
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
