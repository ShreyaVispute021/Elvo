const express = require("express");
const router = express.Router();
const Investment = require("../models/investment.js");
const {isLoggedIn} = require("../middleware.js");

//get portfolio
router.get("/portfolio", isLoggedIn, async (req, res) => {
    const investments = await Investment.find({
        user: req.session.userId
    });
    const totalHoldings = investments.length;
    const totalShares = investments.reduce(
        (sum, inv) => sum + inv.quantity,
        0
    );
    const totalInvested = investments.reduce(
        (sum, inv) => sum + (inv.quantity * inv.buyPrice),
        0
    );
    res.render("portfolio/index", {
        investments,
        totalHoldings,
        totalShares,
        totalInvested
    });
});

//get portfolio new
router.get("/portfolio/new", isLoggedIn, async (req, res) => {
    res.render("portfolio/new");
});

//post portfolio
router.post("/portfolio", isLoggedIn, async (req, res) => {
    const {stockName, quantity, buyPrice} = req.body;
    const investment = new Investment({
        stockName, quantity, buyPrice, user: req.session.userId
    });
    await investment.save();
    res.redirect("/portfolio");
});

//delete portfolio
router.delete("/portfolio/:id", isLoggedIn, async (req, res) => {
    try {
        await Investment.findByIdAndDelete(req.params.id);
        req.flash("success", "Investment Deleted Successfully");
        res.redirect("/portfolio");
    } catch (err) {
        console.log(err);
        req.flash("error", "Unable to delete investment");
        res.redirect("/portfolio");
    }
});

//edit portfolio
router.get("/portfolio/:id/edit", isLoggedIn, async (req, res) => {
    const investment = await Investment.findById(req.params.id);
    res.render("portfolio/edit", {
        investment
    });
});

//update investment
router.put("/portfolio/:id", isLoggedIn, async (req, res) => {
    const { stockName, quantity, buyPrice } = req.body;
    await Investment.findByIdAndUpdate( req.params.id, { stockName, quantity, buyPrice } );
    req.flash("success", "Investment Updated");
    res.redirect("/portfolio");

});

module.exports = router;