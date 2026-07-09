const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({

    stockName: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },

    companyName: {
        type: String,
        default: ""
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    price: {
        type: Number,
        required: true,
        min: 0
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
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Transaction", transactionSchema);