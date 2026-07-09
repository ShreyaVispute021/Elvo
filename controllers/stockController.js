const {
    searchStock,
    getQuote,
    getChart
} = require("../utils/marketHelper");

exports.searchPage = (req, res) => {
    res.render("stocks/search");
};

exports.searchResult = async (req, res) => {

    try {

        const stockMatch = await searchStock(req.query.symbol);

        if (!stockMatch) {
            return res.render("error", {
                message: "Stock not found"
            });
        }

        const stock = await getQuote(stockMatch.symbol);

        const chartData = await getChart(stockMatch.symbol);

        res.render("stocks/show", {
            stock,
            chartData
        });

    } catch (err) {

        console.log(err);

        res.render("error", {
            message: "Unable to fetch stock."
        });

    }

};