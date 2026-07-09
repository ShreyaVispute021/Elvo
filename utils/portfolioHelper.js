const yahooFinance = require("./yahooService");
async function calculatePortfolio(investments) {

    let totalInvested = 0;
    let totalCurrentValue = 0;
    let totalPnL = 0;

    const chartLabels = [];
    const chartData = [];

    for (const investment of investments) {

        try {

            const stock =
                await yahooFinance.quote(
                    investment.stockName
                );

            investment.currentPrice =
                stock.regularMarketPrice || 0;

            investment.currentValue =
                investment.currentPrice *
                investment.quantity;

            investment.investedAmount =
                investment.buyPrice *
                investment.quantity;

            investment.pnl =
                investment.currentValue -
                investment.investedAmount;

            investment.returnPercentage =
                investment.investedAmount === 0
                    ? 0
                    : (
                        investment.pnl /
                        investment.investedAmount
                    ) * 100;

            totalInvested +=
                investment.investedAmount;

            totalCurrentValue +=
                investment.currentValue;

            totalPnL +=
                investment.pnl;

            chartLabels.push(
                investment.stockName.replace(".NS", "")
            );

            chartData.push(
                investment.currentValue
            );

        } catch {

            investment.currentPrice = 0;
            investment.currentValue = 0;
            investment.investedAmount =
                investment.buyPrice *
                investment.quantity;

            investment.pnl =
                -investment.investedAmount;

            investment.returnPercentage = 0;
        }
    }

    return {

        investments,

        totalHoldings:
            investments.length,

        totalShares:
            investments.reduce(
                (sum, investment) =>
                    sum + investment.quantity,
                0
            ),

        totalInvested,

        totalCurrentValue,

        totalPnL,

        totalReturn:
            totalInvested === 0
                ? 0
                : (
                    totalPnL /
                    totalInvested
                ) * 100,

        chartLabels,

        chartData
    };
}

module.exports = {
    calculatePortfolio
};