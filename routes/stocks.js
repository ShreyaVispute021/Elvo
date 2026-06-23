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
        const input = req.query.symbol.trim();
        const searchResult = await yahooFinance.search(input);
        console.log(searchResult.quotes);
        const stockMatch = searchResult.quotes.find(
                q =>
                    q.exchange === "NSI" &&
                    q.quoteType === "EQUITY"
            );
        if (!stockMatch) {
            return res.send("Stock not found");
        }
        const symbol = stockMatch.symbol;
        console.log("Found:", symbol);
        const stock = await yahooFinance.quote(symbol);
        if (!stock) {
            return res.send("Stock not found");
        }
        const chart = await yahooFinance.chart(symbol, {
            period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            period2: new Date(),
            interval: "1d"
        });
        const chartData = chart.quotes.map(q => ({
            x: new Date(q.date).getTime(),
            o: q.open,
            h: q.high,
            l: q.low,
            c: q.close
        }));
        console.log("Chart Quotes:", chart.quotes.length);
        console.log(chartData.slice(0, 5));
        res.render("stocks/show", {
            stock,
            chartData
        });
    } catch (err) {
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
        let investment =
            await Investment.findOne({
                stockName: stock.symbol,
                user: user._id
            });
        if (investment) {
            const totalOldValue = investment.quantity * investment.buyPrice;
            const totalNewValue = quantity * price;
            const totalShares = investment.quantity + quantity;
            const avgPrice = (totalOldValue + totalNewValue) / totalShares;
            investment.quantity = totalShares;
            investment.buyPrice = avgPrice;
            await investment.save();
        } else {
            investment =
                new Investment({
                    stockName: stock.symbol,
                    quantity,
                    buyPrice: price,
                    user: user._id
                });
            await investment.save();
        }
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

router.get("/stocks/:id/sell", async (req, res) => {
    try {
        const investment = await Investment.findById(req.params.id);
        res.render("stocks/sell", {
            investment
        });
    } catch (err) {
        console.log(err);
        res.send("Investment not found");
    }
});

router.post("/stocks/:id/sell", async (req, res) => {
    try {
        const quantityToSell = Number(req.body.quantity);
        const investment = await Investment.findById(req.params.id);
        if (!investment) {
            return res.send("Investment not found");
        }
        if (quantityToSell > investment.quantity) {
            return res.send("Not enough shares");
        }
        const stock =
            await yahooFinance.quote(
                investment.stockName
            );
        const currentPrice = stock.regularMarketPrice;
        const sellValue = quantityToSell * currentPrice;
        const user =
            await User.findById(
                req.session.userId
            );
        user.walletBalance += sellValue;
        await user.save();
        investment.quantity -= quantityToSell;
        if (investment.quantity === 0) {
            await Investment.findByIdAndDelete(
                investment._id
            );
        } else {
            await investment.save();
        }
        await Transaction.create({
            stockName: investment.stockName,
            quantity: quantityToSell,
            price: currentPrice,
            type: "SELL",
            user: user._id
        });
        res.redirect("/portfolio");
    } catch (err) {
        console.log(err);
        res.send("Sell Failed");
    }
});

router.get("/test-search", async (req, res) => {
    console.log("TEST ROUTE HIT");

    try {
        console.log(typeof yahooFinance.search);

        const result =
            await yahooFinance.search(
                "Tata Motors"
            );

        console.log(result);

        res.send("Success");
    } catch(err) {
        console.log("ERROR:");
        console.log(err);

        res.send("Error");
    }
});

module.exports = router;