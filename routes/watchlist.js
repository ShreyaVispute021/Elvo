const express = require("express");
const router = express.Router();

const watchlist = require("../models/watchlist");
const { isLoggedIn } = require("../middleware");

router.get("/watchlist", isLoggedIn, async(req, res) => {
    const stocks = await watchlist.find({
        user: req.session.userId
    });
    res.render("watchlist/index", {
        stocks
    });
});

router.get("/watchlist/new", isLoggedIn, (req, res) => {
    res.render("/watchlist/new");
});

router.post("/watchlist", isLoggedIn, async(req, res) => {
    const { symbol, companyName } = req.body;
    const stock = new watchlist({
        symbol,
        companyName,
        user: req.session.userId
    });
    await stock.save();
    res.redirect("/watchlist");
});



module.exports = router;