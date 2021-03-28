const express = require('express');
const router = express.Router();
const moment = require("moment");
require("moment-duration-format");
const checkAuth = require('../backend/CheckAuth');
 
router.get("/profile", checkAuth, async (req, res) => {

    let userObj = req.client.users.cache.get(req.user.id);

        let userSubscription = {
            undefined: "None",
            0: "None",
            1: "Nitro Classic",
            2: "Nitro Premium"
        };

        let status = {
            "online": "#43b581",
            "idle": "#faa61a",
            "dnd": "#f04747",
            "offline": "#747f8d"
        };
    
        let statusName = {
            "online": "Online",
            "idle": "Idle",
            "dnd": "Do Not Disturb",
            "offline": "Offline"
        };

        const flags = {
            DISCORD_EMPLOYEE: 'Discord Employee ⚒',
            DISCORD_PARTNER: 'Discord Partner ♾',
            PARTNERED_SERVER_OWNER: 'Partnered Server Owner ♾',
            BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1) 🐞',
            BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2) 🐛',
            HYPESQUAD_EVENTS: 'HypeSquad Events',
            HOUSE_BRAVERY: 'House of Bravery',
            HOUSE_BRILLIANCE: 'House of Brilliance',
            HOUSE_BALANCE: 'House of Balance',
            EARLY_SUPPORTER: 'Early Supporter',
            TEAM_USER: 'Team User',
            SYSTEM: 'System',
            VERIFIED_BOT: 'Verified Bot',
            EARLY_VERIFIED_BOT_DEVELOPER: 'Early Verified Bot Developer',
            EARLY_VERIFIED_DEVELOPER: 'Early Verified Developer',
            VERIFIED_DEVELOPER: 'Verified Bot Developer'
        };
    
        let userFlags;

        try {
            userFlags = userObj.flags.toArray();    
        } catch (e) {
            userFlags = [];
        }
    
        res.render("dashboard/profile", {
            tag: (req.user ? req.user.tag : "Login"),
            bot: req.client,
            userObj: userObj,
            userFlags: userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None',
            status: status[userObj.presence.status],
            statusName: statusName[userObj.presence.status],
            moment: moment,
            userSubscription: userSubscription[req.user.premium_type],
            user: req.user || null,
        });
});

router.get("/server/:guildID", checkAuth, async (req, res) => {
    let settings = req.client.settings.get(req.params.guildID);
    let server = req.client.guilds.cache.get(req.params.guildID);

    if (!server && req.user.guilds.filter(u => ((u.permissions & 2146958591) === 2146958591)).map(u => u.id).includes(req.params.guildID)) {
        return res.redirect(`https://discord.com/oauth2/authorize?client_id=${req.client.id}&scope=bot&permissions=0&guild_id=${req.params.guildID}`);  //Full Permissions Invite
    } else if (!server) {
        return res.redirect(`/dashboard/servers`);
    };

    res.render("dashboard/manage.ejs", {
        bot: req.client,
        user: req.user || null,
        guild: server,
        createdAt: moment(req.user.createdAt).format("lll"),
        settings: settings,
    });
});

router.post("/server/:guildID", checkAuth, async (req, res) => {
    let server = req.client.guilds.cache.get(req.params.guildID);
        if (!server) return res.redirect("/dashboard/servers");
        if (!req.client.guilds.cache.get(req.params.guildID).members.cache.get(req.user.id).hasPermission("MANAGE_GUILD")) return res.redirect("/dashboard/servers");

    let data = req.body;

    if (data.hasOwnProperty("prefix")) {
        let newprefix;
        let prefix = req.client.settings.get(server.id, "PREFIX");
        if (!prefix || prefix == null) prefix = '!';
        if (data.prefix.length > 0) newprefix = data.prefix;
        if (newprefix) req.client.settings.set(server.id, newprefix, "prefix");
    };

    await res.redirect(`/dashboard/server/${req.params.guildID}`);

});

router.get("/servers", checkAuth, async(req, res) => {
    res.render("dashboard/servers", {
        tag: (req.user ? req.user.tag : "Login"),
        bot: req.client,
        user: req.user || null,
        guilds: req.user.guilds.filter(u => (u.permissions & 2146958591) === 2146958591)
    });
});

module.exports = router;
