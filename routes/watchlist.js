const express = require("express");

const router = express.Router();

const { isLoggedIn } =
    require("../middleware");

const watchlistController =
    require("../controllers/watchlistController");

router
    .route("/watchlist")
    .get(
        isLoggedIn,
        watchlistController.showWatchlist
    )
    .post(
        isLoggedIn,
        watchlistController.addToWatchlist
    );

router.get(
    "/watchlist/new",
    isLoggedIn,
    watchlistController.showNewWatchlist
);

router.delete(
    "/watchlist/:id",
    isLoggedIn,
    watchlistController.deleteWatchlist
);

module.exports = router;