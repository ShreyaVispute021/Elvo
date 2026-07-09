const User = require("../models/user");
const Investment = require("../models/investment");
const Transaction = require("../models/transaction");

const { getQuote } = require("../utils/marketHelper");

exports.buyPage = async (req, res) => {

    const stock = await getQuote(req.params.symbol);

    res.render("stocks/buy", {
        stock
    });

};

exports.buyStock = async (req, res) => {

    try {

        const quantity = Number(req.body.quantity);

        const stock = await getQuote(req.params.symbol);

        const user = await User.findById(req.session.userId);

        const price = stock.regularMarketPrice;

        const totalCost = quantity * price;

        if (user.walletBalance < totalCost) {

            return res.render("error", {
                message: "Insufficient Wallet Balance"
            });

        }

        user.walletBalance -= totalCost;

        await user.save();

        let investment = await Investment.findOne({
            user: user._id,
            stockName: stock.symbol
        });

        if (investment) {

            const totalValue =
                investment.quantity * investment.buyPrice +
                quantity * price;

            investment.quantity += quantity;

            investment.buyPrice =
                totalValue / investment.quantity;

            await investment.save();

        } else {

            investment = await Investment.create({

                stockName: stock.symbol,

                quantity,

                buyPrice: price,

                user: user._id

            });

        }

        await Transaction.create({

            stockName: stock.symbol,

            quantity,

            price,

            type: "BUY",

            user: user._id

        });

        res.redirect("/portfolio");

    } catch (err) {

        console.log(err);

        res.render("error", {
            message: "Purchase Failed"
        });

    }

};

exports.sellPage = async (req, res) => {

    try {

        const investment = await Investment.findById(req.params.id);

        if (!investment) {
            return res.render("error", {
                message: "Investment not found"
            });
        }

        res.render("stocks/sell", {
            investment
        });

    } catch (err) {

        console.log(err);

        res.render("error", {
            message: "Unable to load investment"
        });

    }

};

exports.sellStock = async (req, res) => {

    try {

        const investment = await Investment.findById(req.params.id);

        if (!investment) {
            return res.render("error", {
                message: "Investment not found"
            });
        }

        const quantity = Number(req.body.quantity);

        if (quantity <= 0) {
            return res.render("error", {
                message: "Invalid quantity"
            });
        }

        if (quantity > investment.quantity) {
            return res.render("error", {
                message: "Not enough shares to sell"
            });
        }

        const stock = await getQuote(investment.stockName);

        const currentPrice = stock.regularMarketPrice;

        const totalAmount = currentPrice * quantity;

        const user = await User.findById(req.session.userId);

        user.walletBalance += totalAmount;

        await user.save();

        investment.quantity -= quantity;

        if (investment.quantity === 0) {

            await Investment.findByIdAndDelete(investment._id);

        } else {

            await investment.save();

        }

        await Transaction.create({

            stockName: investment.stockName,

            quantity,

            price: currentPrice,

            type: "SELL",

            user: user._id

        });

        res.redirect("/portfolio");

    } catch (err) {

        console.log(err);

        res.render("error", {
            message: "Unable to sell stock"
        });

    }

};