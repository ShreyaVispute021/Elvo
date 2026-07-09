const Watchlist = require("../models/watchlist");
const yahooFinance = require("../utils/yahooService");

module.exports.showWatchlist = async (req, res) => {

    try {

        const watchlist = await Watchlist.find({
            user: req.session.userId
        });

        const stocks = [];

        for (const item of watchlist) {

            try {

                const stock =
                    await yahooFinance.quote(
                        item.symbol
                    );

                stocks.push({

                    _id: item._id,

                    symbol: item.symbol,

                    companyName: item.companyName,

                    regularMarketPrice:
                        stock.regularMarketPrice,

                    regularMarketChange:
                        stock.regularMarketChange,

                    regularMarketChangePercent:
                        stock.regularMarketChangePercent

                });

            } catch {

                stocks.push({

                    _id: item._id,

                    symbol: item.symbol,

                    companyName: item.companyName,

                    regularMarketPrice: 0,

                    regularMarketChange: 0,

                    regularMarketChangePercent: 0

                });

            }

        }

        res.render(
            "watchlist/index",
            { stocks }
        );

    } catch (err) {

        console.log(err);

        res.render("error", {
            message: "Unable to load watchlist."
        });

    }

};

module.exports.showNewWatchlist = (req, res) => {

    res.render("watchlist/new");

};

module.exports.addToWatchlist = async (req, res) => {

    try {

        const {
            symbol,
            companyName
        } = req.body;

        const exists =
            await Watchlist.findOne({

                symbol,

                user: req.session.userId

            });

        if (!exists) {

            await Watchlist.create({

                symbol,

                companyName,

                user: req.session.userId

            });

        }

        res.redirect("/watchlist");

    } catch (err) {

        console.log(err);

        res.redirect("/watchlist");

    }

};

module.exports.deleteWatchlist = async (req, res) => {

    try {

        await Watchlist.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/watchlist");

    } catch (err) {

        console.log(err);

        res.redirect("/watchlist");

    }

};