const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Investment = require("../models/investment");
const Watchlist = require("../models/watchlist");
const Transaction = require("../models/transaction");
const bcrypt = require("bcryptjs");
const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

const marketStocks = [
    "TCS.NS",
    "RELIANCE.NS",
    "INFY.NS",
    "HDFCBANK.NS",
    "ICICIBANK.NS",
    "SBIN.NS",
    "BHARTIARTL.NS",
    "ITC.NS",
    "WIPRO.NS",
    "TITAN.NS"
];

router.get("/register", (req,res) => {
    res.render("users/register");
});

router.post("/register", async(req, res) => {
    try {
        const {username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({username, email, password:hashedPassword});
        await newUser.save();
        console.log("User registered successfully");
        res.redirect("/login");
    } catch(err) {
        console.log(err);
        res.send("Error registering user");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login");
})

router.post("/login", async(req, res) => {
    try {
        const {username, password} = req.body;
        const foundUser = await User.findOne({username});
        if(!foundUser) {
            return res.send("User Not Found");
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if(!isMatch) {
            return res.send("Invalid Password");
        }
        req.session.userId = foundUser._id;
        req.session.username = foundUser.username;
        res.redirect("/dashboard");
    } catch(err) {
        console.log(err);
        res.send("Something went wrong");
    }
});

router.get("/dashboard", async (req, res) => {
    if(!req.session.userId) {
        return res.redirect("/login");
    }
    const user = await User.findById(req.session.userId);
    const investments = await Investment.find({
        user: req.session.userId
    });
    const watchlist = await Watchlist.find({
        user: req.session.userId
    });
    const recentTransactions = await Transaction.find({
        user: req.session.userId
    })
    .sort({ createdAt: -1 })
    .limit(5);
    const marketData = [];
    for (const symbol of marketStocks) {
        try {
            const stock = await yahooFinance.quote(symbol);
            marketData.push({
                symbol,
                changePercent: stock.regularMarketChangePercent || 0
            });
        } catch (err) {
            console.log(
                `Failed: ${symbol}`
            );
        }
    }
    const gainers = [...marketData]
            .sort((a, b) =>
                b.changePercent -
                a.changePercent
            )
            .slice(0, 3);
    const losers = [...marketData]
            .sort((a, b) =>
                a.changePercent -
                b.changePercent
            )
            .slice(0, 3);
    const portfolioValue = investments.reduce(
        (sum, inv) => sum + inv.quantity * inv.buyPrice,
        0
    );
    res.render("users/dashboard", {
        username: req.session.username,
        walletBalance: user.walletBalance,
        portfolioValue,
        watchlistCount: watchlist.length,
        recentTransactions,
        gainers,
        losers
    });
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;