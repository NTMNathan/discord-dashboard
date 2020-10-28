const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const session = require("express-session");
const path = require("path");
const ejs = require("ejs");
const passport = require("passport");
const { Strategy } = require("passport-discord");

module.exports.load = async (client) => {

    app.use(bodyparser.json());
    app.use(bodyparser.urlencoded({ extended: true }));
    app.engine("html", ejs.renderFile);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, "/views"));
    app.use(express.static(path.join(__dirname, "/public")));
    app.use(session({
        secret: "BotDashboardExample101",
        resave: false,
        saveUninitialized: false
    }));

    app.use(async function(req, res, next) {
        req.client = client;
        next();
    });

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((obj, done) => {
        done(null, obj);
    });
    passport.use(new Strategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        scope: [ "identify", "guilds" ],
    }, function (accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            return done(null, profile);
        });
    }))

    app.use("/", require("./routes/index"));
    app.use("/dashboard", require("./routes/dashboard"));

    app.listen(process.env.PORT, (err) => {
        console.log(`Webserver now online on port ${process.env.PORT}`);
    });
}