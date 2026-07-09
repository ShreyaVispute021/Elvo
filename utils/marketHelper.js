const yahooFinance = require("./yahooService");

async function searchStock(query) {
    const result = await yahooFinance.search(query);

    return result.quotes.find(
        stock =>
            stock.exchange === "NSI" &&
            stock.quoteType === "EQUITY"
    );
}

async function getQuote(symbol) {
    return await yahooFinance.quote(symbol);
}

async function getChart(symbol, days = 30) {

    const chart = await yahooFinance.chart(symbol, {
        period1: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        period2: new Date(),
        interval: "1d"
    });

    return chart.quotes.map(q => ({
        x: new Date(q.date).getTime(),
        o: q.open,
        h: q.high,
        l: q.low,
        c: q.close
    }));
}

module.exports = {
    searchStock,
    getQuote,
    getChart
};