const Investment = require("../models/investment");
const Transaction = require("../models/transaction");

const { calculatePortfolio } = require("../utils/portfolioHelper");

module.exports.showPortfolio = async (req, res) => {

    try {

        const investments = await Investment.find({
            user: req.session.userId
        });

        const portfolio =
            await calculatePortfolio(
                investments
            );

        res.render("portfolio/index", portfolio);

    } catch (err) {

        console.log(err);

        res.render("error", {
            message: "Unable to load portfolio."
        });

    }

};

module.exports.showNewInvestment = (req, res) => {

    res.render("portfolio/new");

};

module.exports.createInvestment = async (req, res) => {

    try {

        const {
            stockName,
            quantity,
            buyPrice
        } = req.body;

        const investment =
            new Investment({

                stockName,

                quantity,

                buyPrice,

                user: req.session.userId

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

    } catch (err) {

        console.log(err);

        res.render("error", {
            message: "Unable to create investment."
        });

    }

};

module.exports.showEditInvestment = async (req, res) => {

    try {

        const investment =
            await Investment.findById(
                req.params.id
            );

        if (!investment) {

            return res.redirect("/portfolio");

        }

        res.render("portfolio/edit", {
            investment
        });

    } catch (err) {

        console.log(err);

        res.redirect("/portfolio");

    }

};

module.exports.updateInvestment = async (req, res) => {

    try {

        const {

            stockName,

            quantity,

            buyPrice

        } = req.body;

        await Investment.findByIdAndUpdate(

            req.params.id,

            {

                stockName,

                quantity,

                buyPrice

            }

        );

        res.redirect("/portfolio");

    } catch (err) {

        console.log(err);

        res.redirect("/portfolio");

    }

};

module.exports.deleteInvestment = async (req, res) => {

    try {

        await Investment.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/portfolio");

    } catch (err) {

        console.log(err);

        res.redirect("/portfolio");

    }

};

module.exports.showTransactions = async (req, res) => {

    try {

        const transactions =
            await Transaction.find({

                user: req.session.userId

            })
            .sort({
                createdAt: -1
            });

        res.render(
            "transactions/index",
            {
                transactions
            }
        );

    } catch (err) {

        console.log(err);

        res.render("error", {
            message: "Unable to load transactions."
        });

    }

};