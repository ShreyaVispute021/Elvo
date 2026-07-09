const express = require("express");

const router = express.Router();

const investmentController =
    require("../controllers/investmentController");

const { isLoggedIn } =
    require("../middleware");

router
    .route("/portfolio")
    .get(
        isLoggedIn,
        investmentController.showPortfolio
    )
    .post(
        isLoggedIn,
        investmentController.createInvestment
    );

router.get(
    "/portfolio/new",
    isLoggedIn,
    investmentController.showNewInvestment
);

router
    .route("/portfolio/:id")
    .put(
        isLoggedIn,
        investmentController.updateInvestment
    )
    .delete(
        isLoggedIn,
        investmentController.deleteInvestment
    );

router.get(
    "/portfolio/:id/edit",
    isLoggedIn,
    investmentController.showEditInvestment
);

router.get(
    "/transactions",
    isLoggedIn,
    investmentController.showTransactions
);

module.exports = router;