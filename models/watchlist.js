const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
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

watchlistSchema.index({
    user: 1,
    symbol: 1
});

module.exports = mongoose.model("Watchlist", watchlistSchema);