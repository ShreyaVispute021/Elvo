const bcrypt = require("bcryptjs");

const User = require("../models/user");
const Investment = require("../models/investment");
const Watchlist = require("../models/watchlist");
const Transaction = require("../models/transaction");

const yahooFinance = require("../utils/yahooService");
const { calculatePortfolio } = require("../utils/portfolioHelper");

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

module.exports.showRegister = (req, res) => {
    res.render("users/register");
};

module.exports.register = async (req, res) => {
    try {

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (existingUser) {
            return res.render("users/register", {
                error: "Username or Email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.redirect("/login");

    } catch (err) {

        console.log(err);

        res.render("users/register", {
            error: "Unable to register user."
        });

    }
};

module.exports.showLogin = (req, res) => {
    res.render("users/login");
};

module.exports.login = async (req, res) => {

    try {

        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if (!user) {
            return res.render("users/login", {
                error: "Invalid Username or Password"
            });
        }

        const validPassword =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!validPassword) {
            return res.render("users/login", {
                error: "Invalid Username or Password"
            });
        }

        req.session.userId = user._id;
        req.session.username = user.username;

        res.redirect("/dashboard");

    } catch (err) {

        console.log(err);

        res.render("users/login", {
            error: "Something went wrong."
        });

    }

};

module.exports.dashboard = async (req, res) => {

    try {

        const user = await User.findById(
            req.session.userId
        );

        const investments =
            await Investment.find({
                user: user._id
            });

        const watchlist =
            await Watchlist.find({
                user: user._id
            });

        const recentTransactions =
            await Transaction.find({
                user: user._id
            })
            .sort({ createdAt: -1 })
            .limit(5);

        const portfolio =
            await calculatePortfolio(
                investments
            );

        const marketData = [];

        for (const symbol of marketStocks) {

            try {

                const stock =
                    await yahooFinance.quote(symbol);

                marketData.push({

                    symbol,

                    price:
                        stock.regularMarketPrice,

                    change:
                        stock.regularMarketChange,

                    changePercent:
                        stock.regularMarketChangePercent

                });

            } catch {

            }

        }

        const gainers =
            [...marketData]
            .sort(
                (a, b) =>
                    b.changePercent -
                    a.changePercent
            )
            .slice(0, 3);

        const losers =
            [...marketData]
            .sort(
                (a, b) =>
                    a.changePercent -
                    b.changePercent
            )
            .slice(0, 3);

        res.render("users/dashboard", {

            username: user.username,

            walletBalance:
                user.walletBalance,

            portfolioValue:
                portfolio.totalCurrentValue,

            portfolio,

            watchlistCount:
                watchlist.length,

            recentTransactions,

            gainers,

            losers

        });

    } catch (err) {

        console.log(err);

        res.render("error", {
            message: "Unable to load dashboard."
        });

    }

};

module.exports.logout = (req, res) => {

    req.session.destroy(() => {

        res.redirect("/");

    });

};