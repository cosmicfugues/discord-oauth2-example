const express = require("express");
const app = express();
const passport = require("passport");
const { Strategy } = require("passport-discord");
const session = require("express-session");

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

let strategy = new Strategy({
    clientID: "CLIENT_ID",
    clientSecret: "CLIENT_SECRET",
    callbackURL: "http://localhost:3000/callback",
    scope: [ "guilds", "identify"]
}, (accessToken, refreshToken, profile, done) => {
    process.nextTick(() => done(null, profile));
});

passport.use(strategy);

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/giris", passport.authenticate("discord", {
    scope: [ "guilds", "identify" ]
}));

app.get("/callback", passport.authenticate("discord", {
    failureRedirect: "/hata"
}), (req, res) => {
    res.redirect("/");
});

app.get("/", (req, res) => {
    console.log(req.user);
    res.send(req.user ? 
             `Merhaba ${req.user.username}` : 
             "Giriş yapın!");
});

const listener = app.listen(3000, (err) => {
    if (err) throw err;
    console.log(`Site ${listener.address().port} portunda hazır!`);
});