const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    stockName: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["BUY", "SELL"],
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

module.exports = mongoose.model("Transaction", transactionSchema);