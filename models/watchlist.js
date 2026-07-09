const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({

    symbol: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },

    companyName: {
        type: String,
        required: true
    },

    sector: {
        type: String,
        default: ""
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
});

watchlistSchema.index({
    symbol: 1,
    user: 1
}, {
    unique: true
});

module.exports = mongoose.model("Watchlist", watchlistSchema);