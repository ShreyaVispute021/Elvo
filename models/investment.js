const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({

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

    buyPrice: {
        type: Number,
        required: true,
        min: 0
    },

    sector: {
        type: String,
        default: "Unknown"
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Investment", investmentSchema);