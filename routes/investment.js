const express = require("express");
const router = express.Router();
const Investment = require("../models/investment.js");
const {isLoggedIn} = require("../middleware.js");

//get portfolio
router.get("/portfolio", isLoggedIn, async (req, res) => {
    const investments = await Investment.find({
        user: req.session.userId
    });
    res.render("portfolio/index", {
        investments
    });
});

//get portfolio new
router.get("/portfolio/new", isLoggedIn, async (req, res) => {
    res.render("portfolio/new");
});

//post portfolio
router.post("/portfolio", async (req, res) => {
    const {stockName, quantity, buyPrice} = req.body;
    const investment = new Investment({
        stockName, quantity, buyPrice, user: req.session.userId
    });
    await investment.save();
    res.redirect("/portfolio");
});

module.exports = router;