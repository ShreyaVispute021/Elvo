const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");
const tradeController = require("../controllers/tradeController");

const { isLoggedIn } = require("../middleware");

// ---------- Stock Search ----------
router.get(
    "/stocks/search",
    stockController.searchPage
);

router.get(
    "/stocks/result",
    stockController.searchResult
);

// ---------- Buy ----------
router.get(
    "/:symbol/buy",
    isLoggedIn,
    tradeController.buyPage
);

router.post(
    "/:symbol/buy",
    isLoggedIn,
    tradeController.buyStock
);

// ---------- Sell ----------
router.get(
    "/stocks/:id/sell",
    isLoggedIn,
    tradeController.sellPage
);

router.post(
    "/stocks/:id/sell",
    isLoggedIn,
    tradeController.sellStock
);

module.exports = router;