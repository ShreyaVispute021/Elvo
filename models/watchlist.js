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
        ref: "User"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Watchlist", watchlistSchema);