const express = require("express");
const router = express.Router();
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();
const User = require("../models/user");
const Investment = require("../models/investment");
const Transaction = require("../models/transaction");

const stockMap = {
    TCS: "TCS.NS",
    INFY: "INFY.NS",
    RELIANCE: "RELIANCE.NS",
    HDFC: "HDFCBANK.NS",
    HDFCBANK: "HDFCBANK.NS",
    SBI: "SBIN.NS",
    SBIN: "SBIN.NS",
    AIRTEL: "BHARTIARTL.NS",
    BHARTIARTL: "BHARTIARTL.NS",
    ICICI: "ICICIBANK.NS",
    ICICIBANK: "ICICIBANK.NS",
    AXIS: "AXISBANK.NS",
    AXISBANK: "AXISBANK.NS",
    ITC: "ITC.NS",
    LT: "LT.NS",
    KOTAK: "KOTAKBANK.NS",
    KOTAKBANK: "KOTAKBANK.NS",
    ASIANPAINT: "ASIANPAINT.NS",
    MARUTI: "MARUTI.NS",
    TITAN: "TITAN.NS",
    BAJFINANCE: "BAJFINANCE.NS",
    WIPRO: "WIPRO.NS"
};

// Search Page
router.get("/stocks/search", (req, res) => {
    res.render("stocks/search");
});

router.get("/stocks/result", async (req, res) => {
    try {
        // const searchTerm = req.query.symbol.trim().toUpperCase();
        // const symbol = stockMap[searchTerm] || searchTerm + ".NS";
        let input = req.query.symbol.trim().toUpperCase();
        let symbol = stockMap[input];
        if (!symbol) {
            symbol = input + ".NS";
        }
        console.log("User Input:", input);
console.log("Yahoo Symbol:", symbol);
        const stock = await yahooFinance.quote(symbol);
        const chart =
            await yahooFinance.chart(symbol, {
                period1: "2026-05-01",
                period2: "2026-06-19",
                interval: "1d"
            });
        const prices = chart.quotes.map(q => q.close);
        const dates = chart.quotes.map(q => new Date(q.date).toLocaleDateString() );
        res.render("stocks/show", {
            stock,
            prices,
            dates
        });
    } catch(err) {
        console.log(err);
        res.send("Stock not found");
    }
});

router.get("/:symbol/buy", async (req, res) => {
    const stock = await yahooFinance.quote(req.params.symbol);
    res.render("stocks/buy", {
        stock
    });
});

router.post("/:symbol/buy", async (req, res) => {
    try {
        const quantity = Number(req.body.quantity);
        const stock = await yahooFinance.quote(req.params.symbol);
        const price = stock.regularMarketPrice;
        const totalCost = quantity * price;
        const user =
            await User.findById(
                req.session.userId
            );
        if(user.walletBalance < totalCost) {
            return res.send(
                "Insufficient Balance"
            );
        }
        user.walletBalance -= totalCost;
        await user.save();
        const investment =
            new Investment({
                stockName: stock.symbol,
                quantity,
                buyPrice: price,
                user: user._id
            });
        await investment.save();
        const transaction =
            new Transaction({
                stockName: stock.symbol,
                quantity,
                price,
                type: "BUY",
                user: user._id
            });
        await transaction.save();
        res.redirect("/dashboard");
    } catch(err) {
        console.log(err);
        res.send("Purchase Failed");
    }
});

module.exports = router;