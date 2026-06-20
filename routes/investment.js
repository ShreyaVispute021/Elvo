const express = require("express");
const router = express.Router();
const Investment = require("../models/investment.js");
const {isLoggedIn} = require("../middleware.js");
const Transaction = require("../models/transaction");
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

//get portfolio
router.get("/portfolio", isLoggedIn, async (req, res) => {
    let investments = await Investment.find({
        user: req.session.userId
    });
    let totalCurrentValue = 0;
    let totalInvested = 0;
    let totalPnL = 0;
    for (let inv of investments) {
        try {
            const stock =
                await yahooFinance.quote(
                    inv.stockName
                );
            inv.currentPrice = stock.regularMarketPrice;
            inv.currentValue = inv.quantity * inv.currentPrice;
            inv.pnl = inv.currentValue - (inv.quantity * inv.buyPrice);
            totalCurrentValue += inv.currentValue;
            totalInvested += inv.quantity * inv.buyPrice;
            totalPnL += inv.pnl;
        } catch (err) {
            console.log(
                `Error fetching ${inv.stockName}`
            );
            inv.currentPrice = 0;
            inv.currentValue = 0;
            inv.pnl = 0;
        }
    }
    const totalHoldings = investments.length;
    const totalShares =
        investments.reduce(
            (sum, inv) =>
                sum + inv.quantity,
            0
        );
    res.render("portfolio/index", {
        investments,
        totalHoldings,
        totalShares,
        totalInvested,
        totalCurrentValue,
        totalPnL
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
    await Transaction.create({
        stockName,
        quantity,
        price: buyPrice,
        type: "BUY",
        user: req.session.userId
    });
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

router.get("/transactions", isLoggedIn, async (req, res) => {
    const transactions = await Transaction
        .find({ user: req.session.userId })
        .sort({ createdAt: -1 });
    res.render("transactions/index", {
        transactions
    });
});

module.exports = router;