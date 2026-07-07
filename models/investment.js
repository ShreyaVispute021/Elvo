const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
    stockName: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    sector: {
        type: String,
        default: "Unknown"
    },
    quantity: {
        type: Number,
        required: true
    },
    buyPrice: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Investment", investmentSchema);